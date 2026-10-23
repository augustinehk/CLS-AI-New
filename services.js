// ============================================================================
// services.js - Step 2 升級版：
// 1. 植入 CLS 專業法庭盤問出題 Prompt (newprompts_CLSAIcasegen)
// 2. 支援注入「CLS 自訂評分準則與詞彙表 (customRubric)」至 AI 評核引擎
// 3. 新增 exportFullPresetsJsFile()：一鍵生成最新 presets.js 永久保存
// 4. 新增 exportStudentSessionZip()：一鍵將學員全套錄音 + HTML 報告 + JSON 打包成 ZIP
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
2. 特定香港法律術語（嚴禁使用內地法律詞彙）：
   - "joint enterprise" -> 「共同犯罪計劃」（不可譯作共同犯罪集團）
   - "proceeds of an indictable offence" -> 「可公訴罪行嘅得益」
   - "reasonable grounds to believe" -> 「合理理由相信」
   - "money lender's licence" -> 「放債人牌照」
   - "cautioned statement / record" -> 「警誡供詞／會面紀錄」
3. 證人供詞傳譯原則：
   - 必須保留證人原話的防禦情緒、否認力度及地道廣東話俗語（如：砌生豬肉、屈得就屈、陷我於不義、大石砸死蟹）的語意，不可擅自淨化或改寫成平淡書面語。
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

    // 4. OpenRouter TTS 真人語音合成請求
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

    // 5. OpenRouter GLM 語意核證點評 API (支援注入 CLS 自訂評分準則及案件專屬詞彙表)
    async evaluateWithGLM(answer, turnData, apiToUse, preferredGlmModel = "z-ai/glm-4.5-air", customRubric = "", caseGlossary = "") {
        const isEnSource = turnData.lang === "en-US";
        const sourceText = isEnSource ? turnData.text_en : turnData.text_zh;
        const targetText = isEnSource ? turnData.targetText_zh : turnData.targetText_en;

        const rubricBlock = (customRubric || this.DEFAULT_CLS_RUBRIC).trim();
        const glossaryBlock = (caseGlossary || "").trim();

        const evalSystemPrompt = `You are a Principal Court Interpreter Assessor for the Court Language Section (法庭語文組 CLS) of the Hong Kong Judiciary.
Evaluate the trainee's court interpretation strictly according to Hong Kong judicial interpreting standards and the mandatory CLS Rubric below.

${rubricBlock}
${glossaryBlock ? "\n【本案專屬強制術語及評分要點】：\n" + glossaryBlock : ""}

ASSESSMENT CRITERIA (Score 1.0 to 5.0 each, 1 decimal place):
1. "accuracy" (準確度): Completeness of factual details, numbers, dates, physical actions, and exact meaning without omission, addition, or distortion. Accept valid synonyms unless a specific mandatory translation is dictated in the CLS Rubric or Case Glossary above.
2. "tone" (忠實度與語氣): Preservation of register, witness emotion, Hong Kong Cantonese colloquialisms/slang or counsel's assertive demeanour.
3. "legal" (法律合規性): Strict adherence to the CLS Rubric & Case Glossary above (e.g., "I put it to you that..." <-> "我向你指出...", "I suggest to you..." <-> "我向你提出/指出..."), Hong Kong legal terminology, and strict past tense compliance for historical case facts.
4. "delivery" (流暢與精練度): Conciseness, natural courtroom syntax, and absence of garrulousness or fragmented sentences.

Provide your feedback in Traditional Chinese (Hong Kong judicial style) with specific examples from the trainee's input.
IMPORTANT: Do NOT output any thinking process or markdown blocks. Return ONLY raw, valid JSON matching this exact schema:
{
  "scores": {
    "accuracy": 4.5,
    "tone": 4.0,
    "legal": 4.5,
    "delivery": 4.2,
    "overall": 4.3
  },
  "strengths": ["具體優點 1", "具體優點 2"],
  "improvements": ["具體改善建議 1", "具體改善建議 2"]
}`;

        const userPrompt = `Direction: ${isEnSource ? "English Counsel Question -> Cantonese Interpretation" : "Cantonese Witness/Defendant Statement -> English Interpretation"}
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

    // 6. OpenRouter GLM 20輪自訂案件生成 API (使用您審定的 CLS 專業出題 Prompt)
    async generateCaseWithGLM(customBriefText, saveToCategory, apiToUse, preferredGlmModel = "z-ai/glm-4.5-air") {
        const systemPrompt = `You are a Principal Court Interpreter Trainer and Senior Training Officer of the Court Language Section (CLS) of the Hong Kong Judiciary.

MISSION
You are designing a professional courtroom liaison-interpreting training exercise for serving Court Interpreters.
You must convert the supplied Case Fact Brief into an immersive Hong Kong common-law courtroom cross-examination simulation that mirrors real criminal proceedings in the Magistrates' Courts, District Court and Court of First Instance.

The objective is NOT creative storytelling. The objective is rigorous interpreter training.
Accordingly, all dialogue must replicate realistic evidential challenges, adversarial advocacy techniques, witness resistance, and linguistic difficulties routinely encountered in Hong Kong courts.

--------------------------------------------------
COURTROOM REALISM REQUIREMENTS
--------------------------------------------------
The examination must resemble actual Hong Kong criminal trials.

Counsel should:
- Build facts incrementally.
- Control the witness.
- Challenge inconsistencies.
- Introduce exhibits.
- Put alternative narratives.
- Attack credibility, motive, and memory.
- Suggest fabrication, recent invention, collusion, or mistaken identification.

Witnesses should:
- Resist propositions and explain away inconsistencies.
- Avoid direct admissions and occasionally volunteer unnecessary information.
- Become defensive where appropriate.
- Use realistic spoken Hong Kong Cantonese and occasionally evade difficult questions.

Dialogue must sound like live courtroom exchanges, not textbook examples.

--------------------------------------------------
MANDATORY TURN STRUCTURE
--------------------------------------------------
Turns 1-4: Foundation Evidence
- Establish identity, relationship between parties, location, date, and timeline.

Turns 5-8: Material Time
- Focus on what happened, sequence of events, physical actions, positioning, and observations.
- Counsel must repeatedly use: "I put it to you that...", "I suggest to you that...", "At the material time..."

Turns 9-12: Documentary / Electronic Evidence
- Introduce CCTV footage, WhatsApp/Signal/SMS records, bank transfers, Octopus card records, medical reports, or call logs.
- The witness must react realistically to the evidence.

Turns 13-16: Contradictions
- Counsel must challenge previous statements, cautioned interview records, or timeline inconsistencies.
- Mandatory advocacy techniques: "Do you agree that...", "Is it your evidence that...", "I challenge your assertion..."

Turns 17-20: Ultimate Challenge
- Counsel directly confronts with the defence/prosecution case theory.
- e.g., "I put it to you that this complaint was fabricated.", "I suggest to you that your account is entirely untrue."
- The witness must strongly resist the challenge.

--------------------------------------------------
ENGLISH COUNSEL TURNS (ODD NUMBERS: 1, 3, 5... 19)
--------------------------------------------------
- Language: English (en-US)
- Speaker: Prosecutor (主控官) or Defence Counsel (辯方大律師)
- Style: Formal, controlled, precise, and adversarial common-law register.
- Terminology: Infuse terms like "reasonable grounds to believe", "joint enterprise", "proceeds of an indictable offence", "dishonest intent", "recent fabrication", "collusion", "credibility", "motive to lie".
- Do NOT produce casual English.

--------------------------------------------------
TARGET CANTONESE TRANSLATION (targetText_zh for Odd Turns)
--------------------------------------------------
Must represent how an experienced Hong Kong Court Interpreter would render the English question orally for the court:
- Traditional Chinese (Hong Kong judicial spoken Cantonese register).
- Mandatory judicial translations:
  * "I put it to you that..." → "我向你指出……"
  * "I suggest to you that..." → "我向你提出／指出……"
  * "At the material time..." → "喺案發嗰陣／喺關鍵時間……"
  * "Reasonable grounds to believe" → "合理理由相信"
- Strictly avoid Mainland legal terminology (e.g., use 共同犯罪計劃 not 共同犯罪集團).

--------------------------------------------------
WITNESS / DEFENDANT TURNS (EVEN NUMBERS: 2, 4, 6... 20)
--------------------------------------------------
- Language: Authentic Hong Kong Cantonese (zh-HK).
- Speaker: Defendant (被告), Witness (證人), or Victim (事主).
- Style: Spoken, defensive, stressed, or evasive.
- Authentic colloquialisms: e.g., 邊有啲噉嘅事, 冇可能, 屈得就屈, 砌生豬肉, 陷我於不義, 根本冇為意, 講笑咩, 大石砸死蟹.
- Modal particles: 囉 (lo3), 嘛 (maa3), 㗎 (gaa3), 啫 (ze1), 啦 (laa1), 吖嘛 (aa1 maa3).
- Avoid unrealistic underworld excessive vulgarities unless contextually necessary.

--------------------------------------------------
TARGET ENGLISH TRANSLATION (targetText_en for Even Turns)
--------------------------------------------------
Faithful interpretation into court-ready English for the trial Judge:
- Preserve meaning, denials, emotional force, and evidential significance exactly.
- Do NOT sanitise or over-refine defensive witness evidence.

--------------------------------------------------
INTERPRETER TRAINING CALIBRATION
--------------------------------------------------
The 20-turn dialogue MUST deliberately include:
- At least 3 numerical references (dates, times, amounts of money, measurements, phone/account numbers).
- At least 2 timeline challenges.
- At least 2 credibility attacks.
- At least 2 documentary/electronic evidence confrontations.

--------------------------------------------------
OUTPUT FORMAT REQUIREMENTS (STRICT JSON)
--------------------------------------------------
1. Generate EXACTLY 20 turns (Turns 1 to 20). No truncation.
2. Return ONLY raw, valid JSON. Never enclose in markdown fences, no introductory or concluding prose.
3. DATA MAPPING MATRIX RULES:
   - For Odd Turns (English Counsel Question):
     "lang": "en-US"
     "text_en": Counsel's English question.
     "targetText_zh": Authoritative Cantonese court translation.
     "text_zh" and "targetText_en": Must be identical to "text_en".
   - For Even Turns (Cantonese Witness Answer):
     "lang": "zh-HK"
     "text_zh": Witness's spoken Cantonese statement.
     "targetText_en": Accurate, objective court English translation.
     "text_en" and "targetText_zh": Must be identical to "text_zh".

STRICT OUTPUT JSON SCHEMA:
{
  "title_zh": "自訂 ➜ [案件名稱 (中文)]",
  "title_en": "Custom ➜ [Case Title (English)]",
  "category": "criminal",
  "desc_zh": "[案件背景及訓練重點簡介 (中文)]",
  "desc_en": "[Case Brief & Training Focus (English)]",
  "cls_guidelines": "[本案專屬關鍵術語及評分提示，例如：1. joint enterprise -> 共同犯罪計劃]",
  "dialogue": [
    {
      "turn": 1,
      "role_zh": "主控官",
      "role_en": "Prosecutor",
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
            title_zh: parsed.title_zh || ("自訂 ➜ AI (" + usedModel + ") 生成模擬審訊案"),
            title_en: parsed.title_en || "Custom ➜ AI Generated Mock Trial",
            category: saveToCategory,
            desc_zh: parsed.desc_zh || "由 AI 自動生成的 20 輪法庭雙向傳譯練習。",
            desc_en: parsed.desc_en || "20-turn courtroom liaison interpreting exercise generated by AI.",
            cls_guidelines: parsed.cls_guidelines || "",
            dialogue: parsed.dialogue
        };
    },

    // 7. 離線模擬試題生成器 (無 API Key 時備援)
    generateLocalMockCase(customBriefText, saveToCategory) {
        const detectedLocations = customBriefText.match(/(旺角|尖沙咀|銅鑼灣|大圍|荃灣|沙田)/g) || ["旺角"];
        const location = detectedLocations[0];
        const detectedKeywords = customBriefText.match(/(非禮|打|踩|摸|太空油|毒品|合約|借據)/g) || ["非禮及襲擊"];
        const incident = detectedKeywords[0];

        return {
            id: "custom_" + Date.now(),
            title_zh: "自訂 ➜ 模擬" + location + "大樓" + incident + "審訊案",
            title_en: "Custom ➜ Mock " + location + " Building Trial",
            category: saveToCategory,
            desc_zh: "自動根據導入案情要素生成的 10 輪對抗式中英雙向交替口譯考卷。",
            desc_en: "Automatically assembled 10-turn court liaison simulation based on loaded details.",
            cls_guidelines: "",
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

    // 9. 新增：一鍵導出包含所有最新案件（及內嵌語音）的完整 presets.js 原始碼檔案，供永久覆蓋保存！
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

    // 10. 新增：一鍵將學員全套錄音 (.webm) + HTML 評核報告 + 作答數據打包成單一 .zip 下載
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

        // 1. 加入 HTML 評核報告
        const htmlReport = this.buildHTMLReportString({
            currentCase, practiceTurnsLimit, aiEvaluations, userTranslations, traineeName, traineeId, isBlindMode
        });
        rootFolder.file("Evaluation_Report.html", htmlReport);

        // 2. 加入 JSON 完整作答與評分紀錄
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

        // 3. 將所有學員錄音加入到 Audio_Recordings 資料夾
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