// ============================================================================
// services.js - 穩定語音基底 + 分級/場所/特種證人案情生成與評核升級版
// 1. 100% 保持原有穩定版 TTS 語音請求與打包邏輯 (絕不改動聲線參數)
// 2. 植入「審訊場所 (Venue)、難易度 (Level 1-3)、特種證人畫像 (Persona)」出題與評核條款
// 3. 支援注入「CLS 自訂評分準則與詞彙表 (customRubric)」至 AI 評核引擎
// 4. 保留 exportFullPresetsJsFile() 及 exportStudentSessionZip()
// ============================================================================

window.CLS_SERVICES = {
    discoveredGlmModels: null,

    // 預設香港法庭語文組 (CLS) 核心評分準則與詞彙表
    DEFAULT_CLS_RUBRIC: `【香港法庭語文組 (CLS) 強制傳譯評分準則及指定詞彙】：
1. 盤問格式語強制對位：
   - "I put it to you that..." 必須譯為「我向你指出……」
   - "I suggest to you that..." 必須譯為「我向你提出／指出……」
   - "At the material time" 必須譯為「喺案發嗰陣／喺關鍵時間」
   - "I challenge your assertion" 必須譯為「我對你嘅說法提出質疑」
   - "Is it your evidence that..." 必須譯為「你嘅證供係咪話……」
2. 特定香港法律術語（嚴禁使用內地法律詞彙）：
   - "joint enterprise" -> 「共同犯罪計劃」（不可譯作共同犯罪集團）
   - "proceeds of an indictable offence" -> 「可公訴罪行嘅得益」
   - "reasonable grounds to believe" -> 「合理理由相信」
   - "money lender's licence" -> 「放債人牌照」
   - "cautioned statement / record" -> 「警誡供詞／會面紀錄」
   - "wages in lieu of notice" -> 「代通知金」
3. 證人供詞傳譯原則：
   - 必須保留證人原話的防禦情緒、否認力度及地道廣東話俗語（如：砌生豬肉、屈得就屈、陷我於不義、大石砸死蟹、食死貓）的語意，不可擅自淨化或改寫成平淡書面語。
   - 英語傳譯過去發生的案情時，必須嚴格使用過去式（Past Tense）。`,

    async fetchAvailableGlmModels() {
        if (this.discoveredGlmModels && this.discoveredGlmModels.length > 0) {
            return this.discoveredGlmModels;
        }
        try {
            const res = await fetch("https://openrouter.ai/api/v1/models");
            if (!res.ok) return [];
            const data = await res.json();
            const allModels = data.data || [];
            const glmIds = allModels
                .map(m => m.id)
                .filter(id => /(z-ai|thudm|glm)/i.test(id) && !/vision|vl|audio|tts/i.test(id));
            this.discoveredGlmModels = glmIds;
            return glmIds;
        } catch (e) {
            console.warn("無法獲取 OpenRouter 模型列表:", e);
            return [];
        }
    },

    // 1. 將原始 16-bit PCM 音頻封裝為標準 WAV Blob
    pcmToWavBlob(pcmArrayBuffer, sampleRate = 24000, numChannels = 1) {
        const pcmBytes = new Uint8Array(pcmArrayBuffer);
        const wavHeader = new ArrayBuffer(44);
        const view = new DataView(wavHeader);
        const writeStr = (offset, str) => {
            for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
        };
        const byteRate = sampleRate * numChannels * 2;
        const blockAlign = numChannels * 2;

        writeStr(0, 'RIFF');
        view.setUint32(4, 36 + pcmBytes.byteLength, true);
        writeStr(8, 'WAVE');
        writeStr(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, 16, true);
        writeStr(36, 'data');
        view.setUint32(40, pcmBytes.byteLength, true);

        return new Blob([wavHeader, pcmBytes], { type: 'audio/wav' });
    },

    // 2. 將 Blob 轉為 Base64 Data URL
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },

    // 3. 離線備援規則評分引擎
    evaluateTranslationQualityLocal(userInput, targetText, langDirection, fallbackReason = "") {
        const inputClean = (userInput || "").trim();
        const targetClean = (targetText || "").trim();
        
        if (!inputClean) {
            return {
                engine: "local",
                fallbackReason,
                scores: { accuracy: 1.0, tone: 1.0, legal: 1.0, delivery: 1.0, overall: 1.0 },
                strengths: ["無 (None)"],
                improvements: ["學員未有作答。請務必進行口譯。 (No input detected. Please provide your interpretation.)"]
            };
        }

        let strengths = [];
        let improvements = [];
        
        const inputLen = inputClean.length;
        const targetLen = targetClean.length;
        const lengthRatio = inputLen / targetLen;

        let overlapRatio = 0;
        if (langDirection === "en-to-zh") {
            const inputChars = new Set([...inputClean.replace(/[\s,，。！?？\.「」『』]/g, "")]);
            const targetChars = [...targetClean.replace(/[\s,，。！?？\.「」『』]/g, "")];
            let matchedChars = 0;
            targetChars.forEach(char => {
                if (inputChars.has(char)) matchedChars++;
            });
            overlapRatio = targetChars.length ? (matchedChars / targetChars.length) : 0;
        } else {
            const inputWords = new Set((inputClean.toLowerCase().match(/\b\w+\b/g) || []));
            const targetWords = (targetClean.toLowerCase().match(/\b\w+\b/g) || []);
            let matchedWords = 0;
            targetWords.forEach(word => {
                if (inputWords.has(word)) matchedWords++;
            });
            overlapRatio = targetWords.length ? (matchedWords / targetWords.length) : 0;
        }

        let accuracy = 1.0 + (overlapRatio * 3.5);
        let tone = 1.0 + (overlapRatio * 3.2);
        let legal = 1.0 + (overlapRatio * 3.0);
        let delivery = lengthRatio >= 0.75 && lengthRatio <= 1.3 ? 4.7 : (lengthRatio < 0.5 ? 2.5 : 3.6);

        if (lengthRatio < 0.4) {
            accuracy -= 1.2; tone -= 1.0; legal -= 1.0;
            improvements.push("譯文長度嚴重不足。請確保將原聲陳述的所有實質性事實、細節全數譯出。");
        } else if (lengthRatio > 1.6) {
            delivery -= 1.2;
            improvements.push("譯文存在冗餘或贅述（Garrulous Interpretation）。法庭傳譯應追求精練準確，避免過度解說。");
        }

        if (langDirection === "en-to-zh") {
            const hasLegalPrefix = /向.*指出|指出|提出/.test(inputClean);
            const targetHasPrefix = /向.*指出|指出|提出/.test(targetClean);
            if (targetHasPrefix && !hasLegalPrefix) {
                legal -= 1.0;
                improvements.push("漏譯交叉盤問要件語：原聲包含律師盤問格式語，應譯出『我向你指出/提出 (I suggest/put it to you)』。");
            } else if (hasLegalPrefix) {
                legal += 0.4;
                strengths.push("精準捕捉並還原了英美法系交叉盤問（Cross-examination）的核心法律格式語。");
            }

            const hasColloquialParticles = /[囉嘛啫㗎啦吖]/.test(inputClean);
            const targetHasColloquial = /[囉嘛啫㗎啦吖]/.test(targetClean);
            if (targetHasColloquial && !hasColloquialParticles) {
                tone -= 0.6;
                improvements.push("譯文法律修辭正確，但遺漏了證人原供詞中的香港口語助詞（囉/嘛/啫），建構情感原貌略嫌僵化。");
            } else if (hasColloquialParticles) {
                tone += 0.3;
                strengths.push("成功傳神保留香港地道供詞特徵（Modal Particles），貼合證言事實原貌原則。");
            }
        } else {
            const lowerInput = inputClean.toLowerCase();
            const hasEnglishPrefix = /\b(suggest|put\s+it\s+to\s+you|challenge|assert|seriously\s+tell)\b/.test(lowerInput);
            const targetHasEnglishPrefix = /\b(suggest|put\s+it\s+to\s+you|challenge|assert|seriously\s+tell)\b/.test(targetClean.toLowerCase());
            
            if (targetHasEnglishPrefix && !hasEnglishPrefix) {
                legal -= 1.0;
                improvements.push("Missing foundational common-law defense/prosecution framing words (e.g., 'I suggest to you that...').");
            } else if (hasEnglishPrefix) {
                legal += 0.4;
                strengths.push("Excellent appropriation of adversarial legal discourse markers inside common-law settings.");
            }

            const targetHasPast = /\b(was|were|did|had|went|said|saw|felt|squeezed|pushed|obstructed|fabricated)\b/i.test(targetClean);
            const inputHasPast = /\b(was|were|did|had|went|said|saw|felt|squeezed|pushed|obstructed|fabricated|ed)\b/i.test(lowerInput);
            if (targetHasPast && !inputHasPast) {
                accuracy -= 0.6;
                improvements.push("請注意【案發時態合規性】：案情事實屬過去發生的歷史事實（Past facts），傳譯動詞應嚴格使用過去式。");
            } else if (inputHasPast) {
                strengths.push("時態（Tense Verification）處理妥當，精準鎖定案發現場時間線屬性。");
            }
        }

        const targetNumbers = targetClean.match(/\d+/g);
        if (targetNumbers) {
            let missingNum = false;
            targetNumbers.forEach(num => {
                if (!inputClean.includes(num)) missingNum = true;
            });
            if (missingNum) {
                accuracy -= 1.0;
                legal -= 0.5;
                improvements.push("⚠️ 嚴重警告：漏譯案情關鍵核心數字（如距離、時間、次數）。在司法定罪評估中，數字出錯屬於嚴重失實。");
            }
        }

        accuracy = Math.max(1.0, Math.min(5.0, Number(accuracy.toFixed(1))));
        tone = Math.max(1.0, Math.min(5.0, Number(tone.toFixed(1))));
        legal = Math.max(1.0, Math.min(5.0, Number(legal.toFixed(1))));
        delivery = Math.max(1.0, Math.min(5.0, Number(delivery.toFixed(1))));
        
        if (inputLen < 6) {
            accuracy = Math.min(accuracy, 1.5);
            tone = Math.min(tone, 1.5);
            legal = Math.min(legal, 1.5);
            delivery = Math.min(delivery, 1.5);
            improvements = ["輸入長度嚴重殘缺，無法進行司法核證評估 (Input too short for evaluation)。"];
        }

        if (strengths.length === 0) strengths.push("譯文語意大體對位，完成了基礎事實框架的搭建。");
        if (improvements.length === 0) improvements.push("口譯表現高度契合司法標準！請繼續保持此字斟句酌的核證水平。");

        const overall = Number(((accuracy + tone + legal + delivery) / 4).toFixed(1));

        return {
            engine: "local",
            fallbackReason,
            scores: { accuracy, tone, legal, delivery, overall },
            strengths,
            improvements
        };
    },

    lastWorkingModel: null,

    async callOpenRouterChatWithFallback(messages, apiToUse, preferredModel = "z-ai/glm-4.5-air", temperature = 0.2) {
        const candidateModels = [
            this.lastWorkingModel,
            preferredModel,
            "z-ai/glm-4.5-air",
            "z-ai/glm-4.5",
            "thudm/glm-4-32b",
            "deepseek/deepseek-chat"
        ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

        let lastError = null;

        for (const modelId of candidateModels) {
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + apiToUse.trim(),
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://augustinehk.github.io/CLS-AI/",
                        "X-Title": "Court Interpreter AI Suite"
                    },
                    body: JSON.stringify({
                        model: modelId,
                        messages: messages,
                        temperature: temperature
                    })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    const errMsg = errData?.error?.message || ("HTTP " + response.status);
                    
                    if (response.status === 401 || response.status === 402) {
                        throw new Error("OpenRouter 授權或餘額錯誤 (" + response.status + "): " + errMsg);
                    }
                    lastError = new Error("模型 [" + modelId + "] 無法使用 (" + errMsg + ")");
                    continue;
                }

                const data = await response.json();
                const msgObj = data.choices?.[0]?.message || {};
                const rawContent = msgObj.content || msgObj.reasoning || "";
                if (!rawContent.trim()) {
                    lastError = new Error("模型 [" + modelId + "] 回傳空白內容");
                    continue;
                }

                this.lastWorkingModel = modelId;
                return { rawContent, usedModel: modelId };
            } catch (err) {
                lastError = err;
                if (err.message.includes("401") || err.message.includes("402")) {
                    throw err;
                }
            }
        }

        throw lastError || new Error("所有 AI 模型節點均無法連線");
    },

    // 4. OpenRouter TTS 真人語音合成請求 (100% 原封不動保留穩定版邏輯)
    async requestOpenRouterTTSBlob(text, langCode, speakerRole, apiToUse, selectedModel) {
        const isCantonese = langCode === "zh-HK";
        let requestBody = {
            model: selectedModel,
            input: text,
            response_format: "mp3"
        };

        if (selectedModel === "fish-audio/drama-3") {
            const directionTag = isCantonese
                ? "[natural Hong Kong Cantonese speaker, emotional courtroom witness tone] "
                : "[assertive, formal Hong Kong courtroom counsel speaking British-accented legal English] ";
            requestBody.input = directionTag + text;
        } else if (selectedModel.startsWith("elevenlabs/")) {
            requestBody.voice = speakerRole === "questioner" ? "george" : "lily";
        } else if (selectedModel.startsWith("openai/")) {
            requestBody.voice = speakerRole === "questioner" ? "onyx" : "nova";
            requestBody.instructions = isCantonese
                ? "Speak in authentic, natural Hong Kong Cantonese (廣東話) with realistic courtroom witness emotion and colloquial tone."
                : "Speak in a formal, assertive common-law courtroom barrister tone.";
        }

        const response = await fetch("https://openrouter.ai/api/v1/audio/speech", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + apiToUse.trim(),
                "Content-Type": "application/json",
                "HTTP-Referer": "https://augustinehk.github.io/CLS-AI/",
                "X-Title": "Court Interpreter AI Suite"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error("OpenRouter TTS HTTP " + response.status + ": " + errText);
        }

        const contentType = response.headers.get("Content-Type") || "audio/mpeg";
        const arrayBuffer = await response.arrayBuffer();

        if (contentType.includes("audio/pcm")) {
            const rateMatch = contentType.match(/rate=(\d+)/);
            const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
            return this.pcmToWavBlob(arrayBuffer, sampleRate, 1);
        } else {
            return new Blob([arrayBuffer], { type: contentType });
        }
    },

    // 5. OpenRouter GLM 語意核證點評 API (支援依審訊場所、難易度 Level 1-3 及特種證人畫像動態評核)
    async evaluateWithGLM(answer, turnData, apiToUse, preferredGlmModel = "z-ai/glm-4.5-air", customRubric = "", caseGlossary = "", caseMeta = {}) {
        const isEnSource = turnData.lang === "en-US";
        const sourceText = isEnSource ? turnData.text_en : turnData.text_zh;
        const targetText = isEnSource ? turnData.targetText_zh : turnData.targetText_en;

        const rubricBlock = (customRubric || this.DEFAULT_CLS_RUBRIC).trim();
        const glossaryBlock = (caseGlossary || "").trim();
        const difficultyLevel = Number(caseMeta.difficulty || 2);
        const witnessPersona = caseMeta.persona || "standard";
        const courtVenue = caseMeta.venue || "magistrates";

        const evalSystemPrompt = `You are a Principal Court Interpreter Assessor for the Court Language Section (法庭語文組 CLS) of the Hong Kong Judiciary.
Evaluate the trainee's liaison interpretation strictly according to Hong Kong judicial interpreting standards, the mandatory CLS Rubric, and the specific Difficulty & Witness Persona parameters below.

==================================================
1. GLOBAL CLS MANDATORY RUBRIC (全域司法傳譯守則)
==================================================
${rubricBlock}
${glossaryBlock ? "\n【本案專屬強制術語及評分要點 (Case-Specific Glossary)】：\n" + glossaryBlock : ""}

==================================================
2. DYNAMIC TOLERANCE BY DIFFICULTY LEVEL (當前案件難度: LEVEL ${difficultyLevel})
==================================================
- [IF LEVEL 1: FOUNDATIONAL - 入門奠基]:
  * Assessment Focus: Strict baseline compliance. Zero tolerance on advocacy formulae ("I put it to you" -> "我向你指出") and basic numbers/dates. Moderate tolerance on minor delivery hesitations.
- [IF LEVEL 2: OPERATIONAL TRIAL - 常規實戰]:
  * Assessment Focus: Standard liaison proficiency under realistic courtroom speed. Strict scrutiny on past tense consistency, lawyer's control markers, and witness's defensive explanations.
- [IF LEVEL 3: ADVANCED ADVERSARIAL - 進階高壓]:
  * Assessment Focus: Cognitive stamina, legal maneuvering, and discourse management. High scrutiny on compound questions, double negatives, and dense factual clusters. Heavy deduction for "Garrulous Interpretation" or "Summary Paraphrasing".

==================================================
3. WITNESS PERSONA EVALUATION METRICS (當前證人模式: ${witnessPersona} | 場所: ${courtVenue})
==================================================
- [IF PERSONA = street_combative (市井／情緒化證人)]:
  * Check if the trainee conveys the defensive force, disbelief, or frustration into formal English. Flag if the trainee sanitizes street slangs (e.g., 砌生豬肉, 食死貓, 郁手郁腳, 大隻佬) into bland, academic English.
- [IF PERSONA = elderly_garrulous (長者／囉嗦迂迴證人)]:
  * Faithfulness vs. Unauthorized Summarization: In common law courts, the interpreter has NO authority to prune or edit out seemingly irrelevant details. If the trainee summarizes or omits circumstantial details, deduct heavily from "accuracy" and explicitly warn against "擅自刪減或撮要證人供詞".
- [IF PERSONA = non_native (少數族裔／非地道語法證人)]:
  * Semantic Decoding: Check if the trainee accurately extracts the witness's true intent behind inverted Cantonese grammar without inventing facts.
- [IF PERSONA = technical_tribunal (審裁處／技術檢驗證人)]:
  * Zero-tolerance precision on metric units (毫米, 分貝, 平方呎), statutory percentages, wages in lieu of notice (代通知金), and accounting figures.

==================================================
4. SCORING SCHEMA & FEEDBACK OUTPUT (1.0 to 5.0)
==================================================
Evaluate across 4 distinct dimensions (1 decimal place):
1. "accuracy" (準確度): Factual completeness, figures, dates, physical actions, and absence of unauthorized additions/omissions.
2. "tone" (忠實度與語氣): Register fidelity, witness demeanor/defensiveness preservation, and court decorum.
3. "legal" (法律合規性): Strict adherence to the CLS Rubric, mandatory cross-examination formulae, and tense compliance.
4. "delivery" (流暢與精練度): Natural syntax, conciseness, absence of false starts or unforced hesitations.

Provide your feedback in Traditional Chinese (Hong Kong judicial style) with specific examples quoting the trainee's input.
IMPORTANT: Do NOT output any thinking process or markdown blocks. Return ONLY raw, valid JSON matching this exact schema:
{
  "scores": {
    "accuracy": 4.5,
    "tone": 4.0,
    "legal": 4.5,
    "delivery": 4.2,
    "overall": 4.3
  },
  "strengths": ["具體優點 1 (精確引用學員譯文中處理出色的字詞/句式)", "具體優點 2"],
  "improvements": ["具體改善建議 1 (明確指出漏譯或用詞不合 CLS 規範之處，並提供標準參考譯法)", "具體改善建議 2"]
}`;

        const userPrompt = `Court Venue: ${courtVenue === "tribunal" ? "Hong Kong Tribunal (審裁處)" : "Hong Kong Magistrates' Court (裁判法院)"}
Difficulty Level: Level ${difficultyLevel}
Witness Persona: ${witnessPersona}
Direction: ${isEnSource ? "English Question -> Cantonese Interpretation" : "Cantonese Statement -> English Interpretation"}
Speaker Role: ${turnData.role_zh} (${turnData.role_en})
Original Court Statement: "${sourceText}"
Suggested Judicial Reference Translation: "${targetText}"
Trainee's Interpretation Input: "${answer}"

Evaluate the trainee's input strictly against the CLS Rubric and return ONLY the JSON object now.`;

        const { rawContent, usedModel } = await this.callOpenRouterChatWithFallback(
            [
                { role: "system", content: evalSystemPrompt },
                { role: "user", content: userPrompt }
            ],
            apiToUse,
            preferredGlmModel,
            0.2
        );

        const strippedContent = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        const jsonMatch = strippedContent.match(/\{[\s\S]*\}/) || rawContent.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error("AI 回傳格式無法解析為 JSON (" + usedModel + ")");
        }

        const parsed = JSON.parse(jsonMatch[0]);

        const acc = Math.max(1.0, Math.min(5.0, Number(parsed.scores?.accuracy || 3.5)));
        const ton = Math.max(1.0, Math.min(5.0, Number(parsed.scores?.tone || 3.5)));
        const leg = Math.max(1.0, Math.min(5.0, Number(parsed.scores?.legal || 3.5)));
        const del = Math.max(1.0, Math.min(5.0, Number(parsed.scores?.delivery || 3.5)));
        const ovr = Number(((acc + ton + leg + del) / 4).toFixed(1));

        return {
            engine: usedModel,
            scores: {
                accuracy: Number(acc.toFixed(1)),
                tone: Number(ton.toFixed(1)),
                legal: Number(leg.toFixed(1)),
                delivery: Number(del.toFixed(1)),
                overall: ovr
            },
            strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 ? parsed.strengths : ["語意傳達大致準確。"],
            improvements: Array.isArray(parsed.improvements) && parsed.improvements.length > 0 ? parsed.improvements : ["表現良好，可繼續保持。"]
        };
    },

    // 6. OpenRouter GLM 20輪自訂案件生成 API (支援審訊場所、難易度 Level 1-3 及特種證人畫像)
    async generateCaseWithGLM(customBriefText, saveToCategory, apiToUse, preferredGlmModel = "z-ai/glm-4.5-air", genConfig = {}) {
        const venue = genConfig.venue || "magistrates";
        const difficulty = Number(genConfig.difficulty || 2);
        const persona = genConfig.persona || "street_combative";

        const venueInstructions = venue === "tribunal"
            ? `VENUE: HONG KONG TRIBUNALS (審裁處 e.g., Labour Tribunal 勞資審裁處 / Lands Tribunal 土地審裁處 / Small Claims Tribunal 小額錢債審裁處).
Do NOT use "Prosecutor". Odd turns are spoken by the "Presiding Officer" (審裁官).
Even turns are spoken by the "Claimant" (申索人), "Defendant" (被告), or "Technical Witness". Note: In spoken Hong Kong tribunal interpreting, refer to the opposing party directly as "被告" (Defendant), NOT "受索人".
Focus on statutory entitlements, wages in lieu of notice (代通知金), severance payment (遣散費), tenancy breaches, water seepage readings, or invoice calculations.`
            : `VENUE: HONG KONG MAGISTRATES' COURTS / DISTRICT COURT (香港裁判法院 / 區域法院).
Scope: Summary & indictable offences (shop theft, AOABH, common assault, indecent assault, possession of drugs/weapons, money laundering).
Odd turns are spoken by "Prosecutor" (主控官) or "Defence Counsel" (辯方大律師).
Even turns are spoken by "Defendant" (被告), "Victim" (事主), or "Witness" (證人).`;

        const difficultyInstructions = {
            1: `[SELECTED DIFFICULTY: LEVEL 1 - FOUNDATIONAL (入門奠基)]
Sentence Length: Short to medium (English: 15-25 words; Cantonese: 20-35 characters).
Information Density: Max 2 verifiable factual elements per turn (e.g., 1 time + 1 action).
Syntactic Complexity: Simple declarative or direct interrogative sentences. No embedded subordinate clauses or double negatives.
Target Calibration: At least 3 clear numerical references across the 20 turns. Witness delivers direct answers without extensive evasion.`,
            2: `[SELECTED DIFFICULTY: LEVEL 2 - OPERATIONAL TRIAL (常規實戰)]
Sentence Length: Medium to long (English: 25-40 words; Cantonese: 35-60 characters).
Information Density: 3-4 factual elements per turn (timeline juxtaposition, compound conditions).
Syntactic Complexity: Counsel uses multi-part questions, introductory caveats, and confrontational propositions. Witness shows moderate defensiveness and explains away contradictions.
Target Calibration: At least 5 numerical/date/spatial references and at least 2 contradictions based on written witness statements or cautioned interviews.`,
            3: `[SELECTED DIFFICULTY: LEVEL 3 - ADVANCED ADVERSARIAL (進階高壓)]
Sentence Length: Long, dense, high pressure (English: 40-60 words; Cantonese: 60-90+ characters).
Information Density: High cognitive load. 5+ intertwined factual elements, rapid timeline shifts, and aggressive follow-up traps.
Syntactic Complexity: Counsel uses rapid-fire compound questions, double negatives ("Is it not the case that you did not..."), and confrontational propositions. Witness wanders, prevaricates, or strongly resists.
Target Calibration: Dense clusters of phone numbers, vehicle registrations, exact dollar amounts, split-second timelines, and deep evidential confrontation (CCTV timestamp vs. memo book entry vs. oral evidence).`
        }[difficulty];

        const personaInstructions = {
            standard: `[SELECTED WITNESS PERSONA: STANDARD WITNESS (常規標準證人)]
Natural spoken Hong Kong Cantonese (use authentic spoken phrases like 突然醒起 / 叮一聲諗起 rather than bookish 猛然醒起), responsive but defensive when challenged.`,
            street_combative: `[SELECTED WITNESS PERSONA: STREET-LEVEL / HIGHLY COMBATIVE (市井／情緒化證人)]
Profile: Typical local defendant or hawker/driver involved in street scuffles.
Language Characteristics:
- Heavy use of authentic Hong Kong street idioms: 郁手郁腳, 砌生豬肉, 屈得就屈, 講笑咩, 食死貓, 大石砸死蟹, 大隻佬 (instead of bookish 大漢), 吹水, 邊有啲噉嘅事.
- Dense modal particles showing frustration or contempt: 囉, 㗎, 啫, 嘛, 吖嘛, 啦.
- Tendency to answer questions with rhetorical counter-questions: "你問我我問邊個呀？", "你有冇搞錯呀？"`,
            elderly_garrulous: `[SELECTED WITNESS PERSONA: GARRULOUS & CIRCUMSTANTIAL ELDERLY (長者／囉嗦迂迴證人)]
Profile: Elderly victim, neighbourhood witness, or long-time tenant (65+ years old).
Language Characteristics:
- Chronologically slightly rambling, provides circumstantial or familial details before answering the actual question.
- Repeats subjective impressions ("我幾十歲人點會呃你", "我眼矇心唔矇呀").
- Uses colloquial temporal markers: "天矇光嗰陣", "八點三個字", "差唔多食晏時間".
- Ensure the target English translation ("targetText_en") faithfully translates ALL rambling details without summarizing or pruning.`,
            non_native: `[SELECTED WITNESS PERSONA: NON-NATIVE CANTONESE SPEAKER (少數族裔／非地道廣東話證人)]
Profile: South Asian or foreign national testifying in colloquial Hong Kong Cantonese.
Language Characteristics:
- Slightly inverted syntax, missing prepositions, simplified grammatical connectors.
- Occasional insertion of basic English workplace terms inside Cantonese sentences (e.g., "我嗰陣時做緊 delivery 吖嘛，個 boss 叫我擺低先").`,
            technical_tribunal: `[SELECTED WITNESS PERSONA: TECHNICAL / INSPECTION WITNESS (審裁處／專家技術證人)]
Profile: Building surveyor, Labour inspection officer, accountant, or technical claimant.
Language Characteristics:
- Objective, methodical, accounting or measurement-focused.
- Heavy density of measurement units (厘米, 毫米, 滲水讀數, 分貝, 平方呎) or statutory entitlement calculations (代通知金, 遣散費, 平均日薪公式).`
        }[persona] || "";

        const systemPrompt = `You are a Principal Court Interpreter Trainer and Senior Training Officer of the Court Language Section (CLS) of the Hong Kong Judiciary.

MISSION
You are designing a professional courtroom liaison-interpreting training exercise for serving Court Interpreters.
Convert the supplied Case Fact Brief into an immersive 20-turn Hong Kong courtroom/tribunal simulation strictly calibrated to the selected Venue, Difficulty Level, and Witness Persona below.

==================================================
1. VENUE & FORUM CALIBRATION
==================================================
${venueInstructions}

==================================================
2. DIFFICULTY LEVEL CALIBRATION
==================================================
${difficultyInstructions}

==================================================
3. WITNESS PERSONA PROFILE (EVEN TURNS)
==================================================
${personaInstructions}

==================================================
4. MANDATORY TURN STRUCTURE & LANGUAGE RULES
==================================================
Turns 1-4: Foundation Evidence (Identity, relationship between parties, location, date, timeline).
Turns 5-8: Material Time (Sequence of events, physical actions, positioning; repeatedly use "I put it to you that...", "I suggest to you that...", "At the material time...").
Turns 9-12: Documentary / Electronic Evidence (CCTV footage, WhatsApp/Signal records, bank records, punch-cards, medical/inspection reports, contracts).
Turns 13-16: Contradictions ("Do you agree that...", "Is it your evidence that...", "I challenge your assertion...").
Turns 17-20: Ultimate Challenge & strong witness resistance.

MANDATORY TRANSLATION EQUIVALENTS (Odd Turns targetText_zh):
- "I put it to you that..." → "我向你指出……"
- "I suggest to you that..." → "我向你提出／指出……"
- "At the material time..." → "喺案發嗰陣／喺關鍵時間……"
- "Reasonable grounds to believe" → "合理理由相信"
Strictly Traditional Chinese (Hong Kong judicial spoken Cantonese register). Never use Mainland legal terminology or bookish written Chinese (書面語).

==================================================
5. OUTPUT FORMAT REQUIREMENTS (STRICT JSON)
==================================================
1. Generate EXACTLY 20 turns (Turns 1 to 20). No truncation.
2. Return ONLY raw, valid JSON. Never enclose in markdown fences, no introductory or concluding prose.
3. DATA MAPPING MATRIX RULES:
   - For Odd Turns (en-US):
     "lang": "en-US"
     "text_en": English question.
     "targetText_zh": Authoritative Cantonese court translation.
     "text_zh" and "targetText_en": Must be identical to "text_en".
   - For Even Turns (zh-HK):
     "lang": "zh-HK"
     "text_zh": Cantonese witness statement.
     "targetText_en": Faithful, court-ready English translation (do NOT sanitize or summarize).
     "text_en" and "targetText_zh": Must be identical to "text_zh".

STRICT OUTPUT JSON SCHEMA:
{
  "title_zh": "${venue === "tribunal" ? "審裁處" : "裁判法院"} ➜ [Level ${difficulty}] [案件名稱 (中文)]",
  "title_en": "${venue === "tribunal" ? "Tribunal" : "Magistrates' Courts"} ➜ [Level ${difficulty}] [Case Title (English)]",
  "category": "${saveToCategory}",
  "venue": "${venue}",
  "difficulty": ${difficulty},
  "persona": "${persona}",
  "desc_zh": "[案件背景、難度及證人特質訓練重點簡介 (中文)]",
  "desc_en": "[Case Brief & Training Focus (English)]",
  "cls_guidelines": "[列出 3-5 個本案專屬關鍵術語、地道俚語對位及評分標準]",
  "dialogue": [
    {
      "turn": 1,
      "role_zh": "${venue === "tribunal" ? "審裁官" : "主控官"}",
      "role_en": "${venue === "tribunal" ? "Presiding Officer" : "Prosecutor"}",
      "lang": "en-US",
      "text_zh": "English question",
      "text_en": "English question",
      "targetText_zh": "Cantonese translation",
      "targetText_en": "English question"
    }
  ]
}`;

        const { rawContent, usedModel } = await this.callOpenRouterChatWithFallback(
            [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Case Fact Brief:\n" + customBriefText + "\n\nGenerate the full 20-turn JSON now based strictly on the system instructions." }
            ],
            apiToUse,
            preferredGlmModel,
            0.7
        );

        const strippedContent = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        const jsonMatch = strippedContent.match(/\{[\s\S]*\}/) || rawContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("無法從回應中提取 JSON");
        const parsed = JSON.parse(jsonMatch[0]);

        if (!parsed.dialogue || !Array.isArray(parsed.dialogue)) {
            throw new Error("Invalid dialogue array in returned JSON");
        }

        return {
            id: "custom_" + Date.now(),
            title_zh: parsed.title_zh || ("自訂 ➜ [Level " + difficulty + "] AI (" + usedModel + ") 生成模擬審訊案"),
            title_en: parsed.title_en || "Custom ➜ AI Generated Mock Trial",
            category: saveToCategory,
            venue: parsed.venue || venue,
            difficulty: Number(parsed.difficulty || difficulty),
            persona: parsed.persona || persona,
            desc_zh: parsed.desc_zh || "由 AI 自動生成的 20 輪法庭雙向傳譯練習。",
            desc_en: parsed.desc_en || "20-turn courtroom liaison interpreting exercise generated by AI.",
            cls_guidelines: parsed.cls_guidelines || "",
            dialogue: parsed.dialogue
        };
    },

    // 7. 離線模擬試題生成器 (無 API Key 時備援，同樣記錄 venue / difficulty / persona)
    generateLocalMockCase(customBriefText, saveToCategory, genConfig = {}) {
        const detectedLocations = customBriefText.match(/(旺角|尖沙咀|銅鑼灣|大圍|荃灣|沙田)/g) || ["旺角"];
        const location = detectedLocations[0];
        const detectedKeywords = customBriefText.match(/(非禮|打|踩|摸|太空油|毒品|合約|借據|代通知金|漏水)/g) || ["非禮及襲擊"];
        const incident = detectedKeywords[0];
        const venue = genConfig.venue || "magistrates";
        const difficulty = Number(genConfig.difficulty || 2);
        const persona = genConfig.persona || "street_combative";

        return {
            id: "custom_" + Date.now(),
            title_zh: "自訂 ➜ [Level " + difficulty + "] 模擬" + location + incident + "審訊案",
            title_en: "Custom ➜ [Level " + difficulty + "] Mock " + location + " Trial",
            category: saveToCategory,
            venue: venue,
            difficulty: difficulty,
            persona: persona,
            desc_zh: "自動根據導入案情要素生成的 10 輪對抗式中英雙向交替口譯考卷。",
            desc_en: "Automatically assembled 10-turn court liaison simulation based on loaded details.",
            cls_guidelines: "1. 'I suggest to you' -> 我向你指出\n2. 砌生豬肉 -> frame me up / fabricate charges",
            dialogue: [
                { turn: 1, role_zh: "主控官", role_en: "Prosecutor", lang: "en-US", text_zh: "Mr. Chan, I suggest to you that you were present at the corridor in " + location + " at approximately 9:30 p.m., correct?", text_en: "Mr. Chan, I suggest to you that you were present at the corridor in " + location + " at approximately 9:30 p.m., correct?", targetText_zh: "陳先生，我向你指出，你喺大約夜晚九點半嘅時候，出現喺" + location + "嘅走廊通道，係咪？", targetText_en: "Mr. Chan, I suggest to you that you were present at the corridor in " + location + " at approximately 9:30 p.m., correct?" },
                { turn: 2, role_zh: "事主 / 證人", role_en: "Witness", lang: "zh-HK", text_zh: "我當時行得好急去搭車，根本無留意到邊個企喺我左後方囉！", text_en: "I was walking very hastily to take transport, I didn't notice at all who was standing behind my left rear!", targetText_zh: "我當時行得好急去搭車，根本無留意到邊個企喺我左後方囉！", targetText_en: "I was walking very hastily to catch the train, and did not pay any attention at all to who was standing at my left rear!" },
                { turn: 3, role_zh: "主控官", role_en: "Prosecutor", lang: "en-US", text_zh: "The victim felt a physical pressure on her intimate part. What was your arm position at that moment?", text_en: "The victim felt a physical pressure on her intimate part. What was your arm position at that moment?", targetText_zh: "受害人當時感覺到佢嘅敏感部位受到身體壓迫。你當時對手喺咩位置？", targetText_en: "The victim felt a physical pressure on her intimate part. What was your arm position at that moment?" },
                { turn: 4, role_zh: "事主 / 證人", role_en: "Witness", lang: "zh-HK", text_zh: "我兩隻手都拎住嘢，一邊夾住胳肋底，點會有手去非禮佢呢？！", text_en: "Both of my hands were carrying things, with one side tucked under my armpit, how could I have an extra hand to indecently assault her?!", targetText_zh: "我兩隻手都拎住嘢，一邊夾住胳肋底，點會有手去非禮佢呢？！", targetText_en: "Both of my hands were holding things, with one tucked under my armpit, how could I have a free hand to indecently assault her?!" },
                { turn: 5, role_zh: "主控官", role_en: "Prosecutor", lang: "en-US", text_zh: "After she confronted you, did you yell, 'Do you believe I will hit you' in an angry tone?", text_en: "After she confronted you, did you yell, 'Do you believe I will hit you' in an angry tone?", targetText_zh: "喺佢同你理論之後，你係咪好憤怒噉對佢大叫「你信唔信我打你」？", targetText_en: "After she confronted you, did you yell, 'Do you believe I will hit you' in an angry tone?" },
                { turn: 6, role_zh: "事主 / 證人", role_en: "Witness", lang: "zh-HK", text_zh: "我只係一時衝口而出，因為佢無端端踩我鞋踭、仲大聲屈我摸佢籮柚！", text_en: "I only blurted it out impulsively, because she accidentally stepped on the back of my shoes for no reason and loudly framed me for touching her bottom!", targetText_zh: "我只係一時衝口而出，因為佢無端端踩我鞋踭、仲大聲屈我摸佢籮柚！", targetText_en: "I only blurted it out in a moment of anger, because she stepped on my shoe back for no reason and loudly accused me of touching her buttocks!" },
                { turn: 7, role_zh: "辯方大律師", role_en: "Defense Counsel", lang: "en-US", text_zh: "I suggest that the allegation of indecent assault was entirely fabricated to vent your anger over the queue dispute.", text_en: "I suggest that the allegation of indecent assault was entirely fabricated to vent your anger over the queue dispute.", targetText_zh: "我向你指出，非禮嘅指控完全係你捏造出嚟，純粹係為咗發洩你對排隊糾紛嘅不滿。 ", targetText_en: "I suggest that the allegation of indecent assault was entirely fabricated to vent your anger over the queue dispute." },
                { turn: 8, role_zh: "事主 / 證人", role_en: "Witness", lang: "zh-HK", text_zh: "我絕對唔同意。我事後即刻報告地鐵職員，有晒閉路電視，我唔會拿清白講笑！", text_en: "I absolutely disagree. I reported to the MTR staff immediately afterwards, there's CCTV everywhere, I won't joke with my innocence!", targetText_zh: "我絕對唔同意。我事後即刻報告地鐵職員，有晒閉路電視，我唔會拿清白講笑！", targetText_en: "I absolutely disagree. I reported the matter to MTR staff immediately afterwards, there was CCTV, and I would not joke with my reputation!" },
                { turn: 9, role_zh: "辯方大律師", role_en: "Defense Counsel", lang: "en-US", text_zh: "Under the guidelines, any body contact through clothing can still be highly ambiguous. Is it possible it was just a normal brush?", text_en: "Under the guidelines, any body contact through clothing can still be highly ambiguous. Is it possible it was just a normal brush?", targetText_zh: "喺相關指引下，隔住衣物嘅身體接觸都可以好模糊。當時係咪有可能只係普通擦過？", targetText_en: "Under the guidelines, any body contact through clothing can still be highly ambiguous. Is it possible it was just a normal brush?" },
                { turn: 10, role_zh: "事主 / 證人", role_en: "Witness", lang: "zh-HK", text_zh: "絕對唔係。個觸碰好大力，而且係揸咗幾下，點會係唔小心擦過？！", text_en: "Absolutely not. The touching was very forceful and it was squeezed several times, how could it be an accidental brush?!", targetText_zh: "絕對唔係。個觸碰好大力，而且係揸咗幾下，點會係唔小心擦過？！", targetText_en: "Absolutely not. The touch was very hard and it was squeezed several times, how could it be an accidental brush?!" }
            ]
        };
    },

    // 8. 產生 HTML 評核證書字串
    buildHTMLReportString({ currentCase, practiceTurnsLimit, aiEvaluations, userTranslations, traineeName, traineeId, isBlindMode }) {
        const reportTitle = "法庭語文組 (CLS) 培訓評核證書";
        const dateStr = new Date().toLocaleDateString("zh-HK", { year: 'numeric', month: 'long', day: 'numeric' });
        
        const activeDialogueSlice = currentCase.dialogue.slice(0, practiceTurnsLimit);
        let keyWarnings = [];

        const tableRowsHtml = activeDialogueSlice.map((turn) => {
            const evalResult = aiEvaluations[turn.turn];
            const studentAns = userTranslations[turn.turn] || "---";
            const isEnglishSource = turn.lang === "en-US";
            const targetText = isEnglishSource ? turn.targetText_zh : turn.targetText_en;
            const scores = evalResult ? evalResult.scores : { accuracy: "-", tone: "-", legal: "-", delivery: "-", overall: "-" };
            
            let highlightedStudentAns = studentAns;
            if (studentAns !== "---" && targetText) {
                if (studentAns.length < targetText.length * 0.4) {
                    highlightedStudentAns = `<span style="color: #dc2626; font-weight: bold; border-bottom: 2px dashed #dc2626;">${studentAns} (⚠️ 譯文嚴重殘缺)</span>`;
                    keyWarnings.push(`第 ${turn.turn} 題：譯文嚴重殘缺，未完整翻譯法庭原句。`);
                }
            }
            
            if (evalResult && evalResult.improvements.length > 0 && !evalResult.improvements[0].includes("表現高度契合")) {
                 if(keyWarnings.length < 3 && !keyWarnings.some(w => w.includes(`第 ${turn.turn} 題`))) {
                     keyWarnings.push(`第 ${turn.turn} 題：${evalResult.improvements[0]}`);
                 }
            }

            const feedbackHtml = evalResult
                ? `<div style="margin-top:6px; font-size:11px; color:#047857;">✔️ ${evalResult.strengths.join("；")}</div>
                   <div style="margin-top:2px; font-size:11px; color:#be123c;">⚠️ ${evalResult.improvements.join("；")}</div>`
                : "";

            return `
                <tr style="border-bottom: 1px solid #e2e8f0; vertical-align: top;">
                    <td style="padding: 12px; font-weight: 600; color: #1e293b;">第 ${turn.turn} 步<br><span style="font-size: 11px; font-weight: normal; color: #64748b;">${turn.role_en} / ${turn.role_zh}</span></td>
                    <td style="padding: 12px; font-size: 13px; color: #334155;">${isEnglishSource ? turn.text_en : turn.text_zh}</td>
                    <td style="padding: 12px; font-size: 13px; color: #334155;">${highlightedStudentAns}${feedbackHtml}</td>
                    <td style="padding: 12px; font-size: 13px; color: #059669; font-weight: 500;">${targetText}</td>
                    <td style="padding: 12px; font-weight: bold; color: #1e3a8a; text-align: center;">${scores.overall}</td>
                </tr>
            `;
        }).join("");
        
        const warningsHtml = keyWarnings.length > 0 
            ? `<div class="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg mb-6">
                <h4 class="font-bold text-sm mb-2">🔍 重點改善建議 (Key Improvement Areas)</h4>
                <ul class="list-disc pl-5 text-sm">${keyWarnings.map(w => `<li>${w}</li>`).join('')}</ul>
               </div>`
            : '';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${reportTitle}</title>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-gray-50 py-10 px-4 text-gray-900 font-sans">
                <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div class="bg-blue-900 text-white p-8 text-center relative">
                        <div class="text-xs uppercase tracking-widest text-amber-500 font-bold mb-1">Court Language Section (CLS)</div>
                        <h1 class="text-3xl font-extrabold mb-2">法庭語文組 ➜ 實戰口譯及 AI 核證能力評估報告</h1>
                        <p class="text-sm text-blue-200">Official Competency Evaluation & Quality Assurance Certificate</p>
                        <div class="absolute top-4 right-4 no-print">
                            <button onclick="window.print()" class="bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold py-1.5 px-4 rounded text-xs transition duration-150">🖨️ 列印/下載 PDF</button>
                        </div>
                    </div>
                    <div class="p-8">
                        <div class="mb-6">
                            <h3 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">📜 評核學員與案例資訊</h3>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div><span class="font-bold text-gray-600">學員姓名：</span> ${traineeName || "未填寫 (Anonymous)"}</div>
                                <div><span class="font-bold text-gray-600">職員/學員編號：</span> ${traineeId || "N/A"}</div>
                                <div><span class="font-bold text-gray-600">案件名稱：</span> ${currentCase.title_zh}</div>
                                <div><span class="font-bold text-gray-600">評核日期：</span> ${dateStr} (${isBlindMode ? "🎧 盲聽考核模式" : "📖 視聽練習模式"})</div>
                                <div class="col-span-2"><span class="font-bold text-gray-600">案例描述：</span> ${currentCase.desc_zh}</div>
                            </div>
                        </div>
                        ${warningsHtml}
                        <div class="mb-8">
                            <h3 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">📋 評估清單與逐題點評 (共 ${activeDialogueSlice.length} 輪)</h3>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse" style="font-size: 13px;">
                                    <thead>
                                        <tr class="bg-gray-100 text-gray-700">
                                            <th style="padding: 12px; width: 10%;">題號</th>
                                            <th style="padding: 12px; width: 25%;">法庭原聲 (Original)</th>
                                            <th style="padding: 12px; width: 32%;">您的傳譯及 AI 評語</th>
                                            <th style="padding: 12px; width: 25%;">司法標準譯法 (Suggested)</th>
                                            <th style="padding: 12px; text-align: center; width: 8%;">得分</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${tableRowsHtml}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    },

    openHTMLReport(params) {
        const docHtml = this.buildHTMLReportString(params);
        const blob = new Blob([docHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    },

    // 9. 一鍵導出包含所有最新案件（及內嵌語音）的完整 presets.js 原始碼檔案
    exportFullPresetsJsFile(allPresets, TDict) {
        const fileHeader = `// ============================================================================\n// presets.js - 雙語介面語言包 (T) 與預設法庭案件庫 (由系統管理員導出永久保存)\n// 導出時間: ${new Date().toLocaleString("zh-HK")}\n// ============================================================================\n\n`;
        const dataObj = {
            T: TDict,
            ORIGINAL_PRESETS: allPresets
        };
        const jsContent = fileHeader + "window.CLS_DATA = " + JSON.stringify(dataObj, null, 4) + ";\n";
        const blob = new Blob([jsContent], { type: "application/javascript;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "presets.js";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    },

    // 10. 一鍵將學員全套錄音 (.webm) + HTML 評核報告 + 作答數據打包成單一 .zip 下載
    async exportStudentSessionZip({ currentCase, practiceTurnsLimit, aiEvaluations, userTranslations, recordedUrls, traineeName, traineeId, isBlindMode }) {
        if (!window.JSZip) {
            alert("找不到 JSZip 壓縮引擎，請確認 index.html 已引入 jszip.min.js！");
            return;
        }

        const zip = new window.JSZip();
        const safeName = (traineeName || "Trainee").replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, "_");
        const safeCaseId = (currentCase.id || "Case").replace(/[^a-zA-Z0-9_]/g, "_");
        const dateTag = new Date().toISOString().slice(0, 10);
        const folderName = `${safeName}_${safeCaseId}_${dateTag}`;
        const rootFolder = zip.folder(folderName);

        const htmlReport = this.buildHTMLReportString({
            currentCase, practiceTurnsLimit, aiEvaluations, userTranslations, traineeName, traineeId, isBlindMode
        });
        rootFolder.file("Evaluation_Report.html", htmlReport);

        const sessionJson = {
            traineeName: traineeName || "Anonymous",
            traineeId: traineeId || "N/A",
            caseId: currentCase.id,
            caseTitle: currentCase.title_zh,
            exportedAt: new Date().toISOString(),
            userTranslations,
            aiEvaluations
        };
        rootFolder.file("Session_Data.json", JSON.stringify(sessionJson, null, 2));

        const audioFolder = rootFolder.folder("Audio_Recordings");
        const turnKeys = Object.keys(recordedUrls || {});
        for (const tKey of turnKeys) {
            const blobUrl = recordedUrls[tKey];
            if (blobUrl) {
                try {
                    const res = await fetch(blobUrl);
                    const audioBlob = await res.blob();
                    const paddedTurn = String(tKey).padStart(2, "0");
                    audioFolder.file(`Turn_${paddedTurn}_Trainee.webm`, audioBlob);
                } catch (e) {
                    console.warn("無法讀取第 " + tKey + " 題錄音 Blob:", e);
                }
            }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const downloadUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `${folderName}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 8000);
    }
};