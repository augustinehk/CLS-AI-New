// ============================================================================
// presets.js - 雙語介面語言包 (T) 與香港法庭地道標準分級教材庫 (ORIGINAL_PRESETS)
// 已修正：勞審處對造稱「被告」、市井證人稱「大隻佬」、口語改為「突然醒起／叮一聲諗起」
// ============================================================================

window.CLS_DATA = {
    T: {
        zh: {
            appTitle: "法庭語文組 (Court Language Section)",
            appSub: "實戰口譯及 AI 核證質素培訓模擬系統",
            contrastMode: "反白模式",
            trainerConfig: "訓練設定 (Trainer Config)",
            traineeName: "👤 學員姓名",
            traineeId: "🪪 職員/學員編號",
            blindModeTitle: "🎧 盲聽考核模式 (Exam / Blind Mode)",
            blindModeOn: "開啟 (作答前遮蔽原文)",
            blindModeOff: "關閉 (同步顯示原文文字)",
            practiceTurns: "練習輪數",
            speechSpeed: "播放語速",
            ttsModelLabel: "🗣️ 法庭真人發聲引擎",
            presetLibrary: "教材庫清單 (Presets Library)",
            unlockAdmin: "🔒 解鎖管理員",
            adminMode: "🔓 管理模式",
            courtRoom: "法庭模擬口譯 (COURT ROOM)",
            blindBanner: "🔒 盲聽考核模式開啟中：請聽取音頻並進行口譯作答。完成各輪問答後將自動揭曉所有原文及點評。",
            peekBtn: "👁️ 臨時偷看原文",
            hidePeekBtn: "🙈 重新遮蔽原文",
            hearAndInterpret: "👉 請聽音頻，並口譯成：",
            cantonese: "廣東話 (Cantonese)",
            english: "英語 (English)",
            yourTranslation: "✍️ 您的傳譯譯文：",
            startRecord: "開始錄音 (Record)",
            stopRecord: "停止錄音 (Stop)",
            textareaPlaceholder: "請點擊開始錄音，或在此處手動輸入您的譯文...",
            playback: "🎙️ 學員語音備份 (Playback)",
            prevBtn: "上一步",
            submitBtn: "提交 AI 質素點評",
            gradingBtn: "⏳ AI 核證分析中...",
            nextBtn: "下一條問答",
            aiEvalTitle: "📊 AI 語意核證分析點評",
            yourInput: "✍️ 您的傳譯譯文:",
            suggestedAns: "🌟 建議參考譯法:",
            strengths: "✔️ 好的部分 (Strengths)",
            improvements: "⚠️ 需要改善的部分 (Areas for Improvement)",
            customImportTitle: "自訂案情導入 (PDF/DOCX/TXT/JSON)",
            customImportDesc: "上載案情摘要或直接粘貼控罪事實，並可自由配置審訊場所、難易度 Level 1-3、特種證人畫像及角色男女聲線。",
            uploadFile: "📁 選擇或拖曳案情文件 (.pdf/.docx/.txt/.json)",
            apiKey: "🔑 API 金鑰 (驅動 AI 與真人發音)",
            importPlaceholder: "或在此處直接粘貼案件描述與控罪細節...",
            category: "🎯 歸類至：",
            criminal: "刑事案件",
            civil: "民事案件",
            custom: "自訂教材",
            generateBtn: "⚙️ 自動模擬生成問答 (AI)",
            generating: "正在智慧拼裝中...",
            dashboardTitle: "綜合評估報告 Dashboard",
            openCertBtn: "📋 開啟交互式 HTML 評核證書",
            avgAcc: "平均準確度",
            avgTone: "平均忠實度",
            avgLegal: "平均合規性",
            avgDel: "流暢與儀態",
            overallIdx: "綜合指數"
        },
        en: {
            appTitle: "Court Language Section (CLS)",
            appSub: "Liaison Interpreting & AI Quality Assurance Suite",
            contrastMode: "Contrast",
            trainerConfig: "Trainer Config",
            traineeName: "👤 Trainee Name",
            traineeId: "🪪 Staff / Trainee ID",
            blindModeTitle: "🎧 Blind Listening Exam Mode",
            blindModeOn: "ON (Hide source text before grading)",
            blindModeOff: "OFF (Show source text)",
            practiceTurns: "Practice Turns",
            speechSpeed: "Playback Speed",
            ttsModelLabel: "🗣️ Natural Human Voice Engine",
            presetLibrary: "Presets Library",
            unlockAdmin: "🔒 Unlock Admin",
            adminMode: "🔓 Admin Mode",
            courtRoom: "ACTIVE COURT ROOM",
            blindBanner: "🔒 Blind Exam Mode Active: Listen to the audio and interpret. Source text will be revealed automatically after completing the turns.",
            peekBtn: "👁️ Peek Source Text",
            hidePeekBtn: "🙈 Hide Source Text",
            hearAndInterpret: "👉 Interpret into:",
            cantonese: "Cantonese",
            english: "English",
            yourTranslation: "✍️ Your Translation:",
            startRecord: "Start Record",
            stopRecord: "Stop Record",
            textareaPlaceholder: "Click record or type your translation here...",
            playback: "🎙️ Voice Playback",
            prevBtn: "Prev",
            submitBtn: "AI Evaluator",
            gradingBtn: "⏳ AI Grading...",
            nextBtn: "Next",
            aiEvalTitle: "📊 AI Grading Insights",
            yourInput: "✍️ Your Input:",
            suggestedAns: "🌟 Suggested Target:",
            strengths: "✔️ Strengths",
            improvements: "⚠️ Areas for Improvement",
            customImportTitle: "Custom Case Importer (PDF/DOCX/TXT/JSON)",
            customImportDesc: "Upload case brief and customize venue, difficulty levels 1-3, witness personas, and consistent voice assignments.",
            uploadFile: "📁 Upload Case File (.pdf/.docx/.txt/.json)",
            apiKey: "🔑 API Key",
            importPlaceholder: "Or paste case descriptions here...",
            category: "🎯 Category:",
            criminal: "Criminal",
            civil: "Civil",
            custom: "Custom",
            generateBtn: "⚙️ Generate Simulation (AI)",
            generating: "Assembling via AI...",
            dashboardTitle: "Evaluation Dashboard",
            openCertBtn: "📋 Open HTML Certificate",
            avgAcc: "Accuracy",
            avgTone: "Tone",
            avgLegal: "Legal Terms",
            avgDel: "Delivery",
            overallIdx: "Overall Index"
        }
    },

    ORIGINAL_PRESETS: [
        // ====================================================================
        // Case 1: 裁判法院 Level 1 (入門奠基) · 店舖盜竊案
        // ====================================================================
        {
            id: "preset_mag_shoptheft_l1",
            title_zh: "裁判法院 ➜ [Level 1 入門奠基] 連鎖店舖盜竊案 (WKCC 102/2026)",
            title_en: "Magistrates' Courts ➜ [Level 1 Foundational] Shop Theft (WKCC 102/2026)",
            category: "criminal",
            venue: "magistrates",
            difficulty: 1,
            persona: "standard",
            voice_config: {
                counsel_gender: "male",
                witness_gender: "female",
                witness_age_group: "adult"
            },
            desc_zh: "適合新入職傳譯主任奠基練習。涉及被告在萬寧被指控未經付款將化妝品放入環保袋。句子長度適中，事實單向推進，著重考驗「我向你指出」、「在關鍵時間」等標準盤問公式及數字、貨品名稱的精準對位。",
            desc_en: "Calibrated for trainee interpreters. Focuses on straightforward shop theft at a retail store. Emphasizes mandatory advocacy formulae, exact item counts, and pricing precision.",
            cls_guidelines: "1. 'I put it to you that...' 必須譯為「我向你指出……」\n2. 'at the material time' 必須譯為「喺案發嗰陣／關鍵時間」\n3. 'dishonest intent' 必須譯為「不誠實意圖」\n4. 貨品數量與金額（三件精華素、港幣840元）必須零容錯。",
            dialogue: [
                {
                    turn: 1, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "Madam, at the material time on 12th January 2026, you entered the Mannings store at Langham Place, correct?",
                    text_en: "Madam, at the material time on 12th January 2026, you entered the Mannings store at Langham Place, correct?",
                    targetText_zh: "女士，喺案發嗰陣，即係2026年1月12號，你入咗朗豪坊嘅萬寧店舖，係咪？",
                    targetText_en: "Madam, at the material time on 12th January 2026, you entered the Mannings store at Langham Place, correct?"
                },
                {
                    turn: 2, role_zh: "被告 (陳女士)", role_en: "Defendant (Ms. Chan)", gender: "female", age_group: "adult", lang: "zh-HK",
                    text_zh: "係，大約下晝三點半左右，我一個人入去諗住買日用品。",
                    text_en: "Yes, at around 3:30 p.m., I went in alone intending to buy daily groceries.",
                    targetText_zh: "係，大約下晝三點半左右，我一個人入去諗住買日用品。",
                    targetText_en: "Yes, at around 3:30 p.m., I went in alone intending to buy daily groceries."
                },
                {
                    turn: 3, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "You were carrying a brown personal handbag and a green recycling bag, is that right?",
                    text_en: "You were carrying a brown personal handbag and a green recycling bag, is that right?",
                    targetText_zh: "你當時攜帶著一個啡色手袋同埋一個綠色環保袋，啱唔啱？",
                    targetText_en: "You were carrying a brown personal handbag and a green recycling bag, is that right?"
                },
                {
                    turn: 4, role_zh: "被告 (陳女士)", role_en: "Defendant (Ms. Chan)", gender: "female", age_group: "adult", lang: "zh-HK",
                    text_zh: "啱，個綠色環保袋係我自己喺屋企帶出嚟嘅。",
                    text_en: "Correct, that green recycling bag was brought from home by myself.",
                    targetText_zh: "啱，個綠色環保袋係我自己喺屋企帶出嚟嘅。",
                    targetText_en: "Correct, that green recycling bag was brought from home by myself."
                },
                {
                    turn: 5, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "At the skincare counter, you took three bottles of face serum from the shelf, did you not?",
                    text_en: "At the skincare counter, you took three bottles of face serum from the shelf, did you not?",
                    targetText_zh: "喺護膚品專櫃嗰度，你喺貨架上面攞咗三樽精華素，係咪？",
                    targetText_en: "At the skincare counter, you took three bottles of face serum from the shelf, did you not?"
                },
                {
                    turn: 6, role_zh: "被告 (陳女士)", role_en: "Defendant (Ms. Chan)", gender: "female", age_group: "adult", lang: "zh-HK",
                    text_zh: "係，因為當時做緊買二送一嘅推廣優惠。",
                    text_en: "Yes, because there was a buy-two-get-one-free promotional offer at that time.",
                    targetText_zh: "係，因為當時做緊買二送一嘅推廣優惠。",
                    targetText_en: "Yes, because there was a buy-two-get-one-free promotional offer at that time."
                },
                {
                    turn: 7, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "I suggest to you that instead of placing them into a shopping basket, you put all three bottles directly into your green recycling bag.",
                    text_en: "I suggest to you that instead of placing them into a shopping basket, you put all three bottles directly into your green recycling bag.",
                    targetText_zh: "我向你提出，你並無將佢哋放入購物籃，而係直接將嗰三樽精華素放咗入你嘅綠色環保袋入面。",
                    targetText_en: "I suggest to you that instead of placing them into a shopping basket, you put all three bottles directly into your green recycling bag."
                },
                {
                    turn: 8, role_zh: "被告 (陳女士)", role_en: "Defendant (Ms. Chan)", gender: "female", age_group: "adult", lang: "zh-HK",
                    text_zh: "我同意，因為當時門口嘅購物籃已經畀人攞晒。",
                    text_en: "I agree, because all shopping baskets at the entrance were taken by others at that moment.",
                    targetText_zh: "我同意，因為當時門口嘅購物籃已經畀人攞晒。",
                    targetText_en: "I agree, because all shopping baskets at the entrance were taken by others at that moment."
                },
                {
                    turn: 9, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "Let me show you Exhibit P1, the store CCTV footage. You then walked to the cashier counter and only paid for a packet of wet tissues.",
                    text_en: "Let me show you Exhibit P1, the store CCTV footage. You then walked to the cashier counter and only paid for a packet of wet tissues.",
                    targetText_zh: "等我向你展示證物P1，即係店舖閉路電視片段。你之後行去收銀處，而且淨係畀咗一包濕紙巾嘅錢。",
                    targetText_en: "Let me show you Exhibit P1, the store CCTV footage. You then walked to the cashier counter and only paid for a packet of wet tissues."
                },
                {
                    turn: 10, role_zh: "被告 (陳女士)", role_en: "Defendant (Ms. Chan)", gender: "female", age_group: "adult", lang: "zh-HK",
                    text_zh: "係，嗰包濕紙巾係十二蚊，我用八達通畀咗錢。",
                    text_en: "Yes, that packet of wet tissues was 12 dollars, and I paid by Octopus card.",
                    targetText_zh: "係，嗰包濕紙巾係十二蚊，我用八達通畀咗錢。",
                    targetText_en: "Yes, that packet of wet tissues was 12 dollars, and I paid by Octopus card."
                },
                {
                    turn: 11, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "You did not take out the three bottles of serum, which cost a total of 840 dollars, to pay for them, correct?",
                    text_en: "You did not take out the three bottles of serum, which cost a total of 840 dollars, to pay for them, correct?",
                    targetText_zh: "你無攞出總值八百四十蚊嘅三樽精華素出嚟畀錢，啱唔啱？",
                    targetText_en: "You did not take out the three bottles of serum, which cost a total of 840 dollars, to pay for them, correct?"
                },
                {
                    turn: 12, role_zh: "被告 (陳女士)", role_en: "Defendant (Ms. Chan)", gender: "female", age_group: "adult", lang: "zh-HK",
                    text_zh: "啱，我嗰陣時真係完全唔記得咗個袋入面仲有嗰三樽嘢。",
                    text_en: "Correct. I really completely forgot at that time that those three bottles were inside my bag.",
                    targetText_zh: "啱，我嗰陣時真係完全唔記得咗個袋入面仲有嗰三樽嘢。",
                    targetText_en: "Correct. I really completely forgot at that time that those three bottles were inside my bag."
                },
                {
                    turn: 13, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "Do you agree that after paying for the wet tissues, you immediately walked past the anti-theft sensors and exited the store?",
                    text_en: "Do you agree that after paying for the wet tissues, you immediately walked past the anti-theft sensors and exited the store?",
                    targetText_zh: "你同唔同意畀咗濕紙巾錢之後，你即刻行過防盜感應門離開咗間舖頭？",
                    targetText_en: "Do you agree that after paying for the wet tissues, you immediately walked past the anti-theft sensors and exited the store?"
                },
                {
                    turn: 14, role_zh: "被告 (陳女士)", role_en: "Defendant (Ms. Chan)", gender: "female", age_group: "adult", lang: "zh-HK",
                    text_zh: "同意，因為我突然收到我個仔學校打嚟嘅緊急電話。",
                    text_en: "I agree, because I suddenly received an urgent phone call from my son's school.",
                    targetText_zh: "同意，因為我突然收到我個仔學校打嚟嘅緊急電話。",
                    targetText_en: "I agree, because I suddenly received an urgent phone call from my son's school."
                },
                {
                    turn: 15, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "Is it your evidence that you were intercepted by the store detective outside the shop entrance?",
                    text_en: "Is it your evidence that you were intercepted by the store detective outside the shop entrance?",
                    targetText_zh: "你嘅證供係咪話，你喺舖頭門口外面被便衣保安員截停？",
                    targetText_en: "Is it your evidence that you were intercepted by the store detective outside the shop entrance?"
                },
                {
                    turn: 16, role_zh: "被告 (陳女士)", role_en: "Defendant (Ms. Chan)", gender: "female", age_group: "adult", lang: "zh-HK",
                    text_zh: "係，佢截停我之後，我先叮一聲諗起仲未畀錢，我即時話可以畀返錢。",
                    text_en: "Yes, after he stopped me, it just hit me that I had not paid, and I immediately said I could pay for them.",
                    targetText_zh: "係，佢截停我之後，我先叮一聲諗起仲未畀錢，我即時話可以畀返錢。",
                    targetText_en: "Yes, after he stopped me, it just hit me that I had not paid, and I immediately said I could pay for them."
                },
                {
                    turn: 17, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "I challenge your assertion. According to your phone records, that school call only occurred five minutes after your interception.",
                    text_en: "I challenge your assertion. According to your phone records, that school call only occurred five minutes after your interception.",
                    targetText_zh: "我對你嘅說法提出質疑。根據你嘅通話紀錄，嗰個學校電話係喺你被截停之後五分鐘先至打嚟。",
                    targetText_en: "I challenge your assertion. According to your phone records, that school call only occurred five minutes after your interception."
                },
                {
                    turn: 18, role_zh: "被告 (陳女士)", role_en: "Defendant (Ms. Chan)", gender: "female", age_group: "adult", lang: "zh-HK",
                    text_zh: "我可能記錯咗通話時間，但我真係冇心偷嘢。",
                    text_en: "I might have misremembered the time of the call, but I really had no intention to steal.",
                    targetText_zh: "我可能記錯咗通話時間，但我真係冇心偷嘢。",
                    targetText_en: "I might have misremembered the time of the call, but I really had no intention to steal."
                },
                {
                    turn: 19, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "I put it to you that you deliberately concealed those three bottles with dishonest intent to permanently deprive the store of them.",
                    text_en: "I put it to you that you deliberately concealed those three bottles with dishonest intent to permanently deprive the store of them.",
                    targetText_zh: "我向你指出，你係蓄意隱藏嗰三樽精華素，帶有不誠實意圖去永久剝奪店舖嘅財產。",
                    targetText_en: "I put it to you that you deliberately concealed those three bottles with dishonest intent to permanently deprive the store of them."
                },
                {
                    turn: 20, role_zh: "被告 (陳女士)", role_en: "Defendant (Ms. Chan)", gender: "female", age_group: "adult", lang: "zh-HK",
                    text_zh: "我絕對唔同意。我有正當職業，我只係一時大意分心，絕非存心偷竊。",
                    text_en: "I absolutely disagree. I have a proper job. I was merely careless and distracted for a moment, and definitely did not steal intentionally.",
                    targetText_zh: "我絕對唔同意。我有正當職業，我只係一時大意分心，絕非存心偷竊。",
                    targetText_en: "I absolutely disagree. I have a proper job. I was merely careless and distracted for a moment, and definitely did not steal intentionally."
                }
            ]
        },

        // ====================================================================
        // Case 2: 裁判法院 Level 2 (常規實戰) · 市井情緒化證人
        // ====================================================================
        {
            id: "preset_mag_assault_l2",
            title_zh: "裁判法院 ➜ [Level 2 市井情緒化證人] 快餐店普通襲擊及抗拒警員案 (KCCC 881/2026)",
            title_en: "Magistrates' Courts ➜ [Level 2 Street Persona] Common Assault & Resisting Police (KCCC 881/2026)",
            category: "criminal",
            venue: "magistrates",
            difficulty: 2,
            persona: "street_combative",
            voice_config: {
                counsel_gender: "male",
                witness_gender: "male",
                witness_age_group: "adult"
            },
            desc_zh: "典型裁判法院對抗式實戰案件。涉及被告在旺角快餐店因排隊糾紛與市民打鬥並抗拒警員拘捕。證人性格暴躁、防禦性極強，大量夾雜「郁手郁腳、砌生豬肉、屈得就屈、食死貓、大隻佬」等香港地道俚語，考驗傳譯員在不淨化證供下傳神口譯。",
            desc_en: "Realistic Magistrates' Court trial featuring an aggressive street defendant. Tests high-pressure interpretation of volatile Cantonese street slang and rapid defense rebuttals.",
            cls_guidelines: "1. 盤問要件語：'I suggest to you that' -> 「我向你指出/提出」\n2. 市井俚語對位：\n   - 「郁手郁腳」-> got physical / used physical force\n   - 「砌生豬肉」-> frame me up / fabricate charges\n   - 「屈得就屈」-> framing arbitrarily / making up accusations at will\n   - 「食死貓」-> take the blame / swallow the false blame\n   - 「大隻佬」-> big muscular men / burly guys\n3. 警務術語：'due execution of duty' -> 「正當執行職務」。",
            dialogue: [
                {
                    turn: 1, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "Mr. Kwok, at the material time on 3rd March 2026, you were waiting in the queue at Cafe de Coral on Sai Yeung Choi Street, correct?",
                    text_en: "Mr. Kwok, at the material time on 3rd March 2026, you were waiting in the queue at Cafe de Coral on Sai Yeung Choi Street, correct?",
                    targetText_zh: "郭先生，喺案發嗰陣，即係2026年3月3號，你當時喺西洋菜街嘅大家樂排緊隊，係咪？",
                    targetText_en: "Mr. Kwok, at the material time on 3rd March 2026, you were waiting in the queue at Cafe de Coral on Sai Yeung Choi Street, correct?"
                },
                {
                    turn: 2, role_zh: "被告 (郭先生)", role_en: "Defendant (Mr. Kwok)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "係呀，晏晝一點幾成間舖頭迫到爆，我正正經經企喺度排隊買外賣囉！",
                    text_en: "Yeah, past 1:00 p.m. the whole shop was jam-packed. I was standing there properly queuing for takeaway!",
                    targetText_zh: "係呀，晏晝一點幾成間舖頭迫到爆，我正正經經企喺度排隊買外賣囉！",
                    targetText_en: "Yeah, past 1:00 p.m. the whole shop was jam-packed. I was standing there properly queuing for takeaway!"
                },
                {
                    turn: 3, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "The victim, Mr. Lee, who was behind you, accidentally bumped into your backpack, is that right?",
                    text_en: "The victim, Mr. Lee, who was behind you, accidentally bumped into your backpack, is that right?",
                    targetText_zh: "喺你後面嘅事主李先生唔小心撞到你嘅背囊，啱唔啱？",
                    targetText_en: "The victim, Mr. Lee, who was behind you, accidentally bumped into your backpack, is that right?"
                },
                {
                    turn: 4, role_zh: "被告 (郭先生)", role_en: "Defendant (Mr. Kwok)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "唔小心？佢起碼大力撞咗我三四次，直情成個人「挨」埋嚟，擺明插隊挑釁啦！",
                    text_en: "Accidentally? He bumped into me forcefully at least three or four times, literally leaning his whole body onto me. He was obviously provoking me and cutting the queue!",
                    targetText_zh: "唔小心？佢起碼大力撞咗我三四次，直情成個人「挨」埋嚟，擺明插隊挑釁啦！",
                    targetText_en: "Accidentally? He bumped into me forcefully at least three or four times, literally leaning his whole body onto me. He was obviously provoking me and cutting the queue!"
                },
                {
                    turn: 5, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "I put it to you that you suddenly turned around, swore aggressively, and punched Mr. Lee in the chest.",
                    text_en: "I put it to you that you suddenly turned around, swore aggressively, and punched Mr. Lee in the chest.",
                    targetText_zh: "我向你指出，你突然轉身，好兇咁爆粗口，仲出拳打咗李先生嘅胸口一拳。",
                    targetText_en: "I put it to you that you suddenly turned around, swore aggressively, and punched Mr. Lee in the chest."
                },
                {
                    turn: 6, role_zh: "被告 (郭先生)", role_en: "Defendant (Mr. Kwok)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "講笑咩！邊有啲噉嘅事！係佢衝埋嚟想郁手郁腳，我只不過係舉起雙手自衛推開佢啫！",
                    text_en: "You must be kidding! No such thing! It was him dashing over trying to get physical; I merely raised both hands in self-defense to push him away!",
                    targetText_zh: "講笑咩！邊有啲噉嘅事！係佢衝埋嚟想郁手郁腳，我只不過係舉起雙手自衛推開佢啫！",
                    targetText_en: "You must be kidding! No such thing! It was him dashing over trying to get physical; I merely raised both hands in self-defense to push him away!"
                },
                {
                    turn: 7, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "Mr. Lee suffered visible contusions over his sternum, which is fully corroborated by the medical report, Exhibit P2.",
                    text_en: "Mr. Lee suffered visible contusions over his sternum, which is fully corroborated by the medical report, Exhibit P2.",
                    targetText_zh: "李先生嘅胸骨位置有明顯嘅瘀傷，呢點喺醫療報告（證物P2）入面完全獲得證實。",
                    targetText_en: "Mr. Lee suffered visible contusions over his sternum, which is fully corroborated by the medical report, Exhibit P2."
                },
                {
                    turn: 8, role_zh: "被告 (郭先生)", role_en: "Defendant (Mr. Kwok)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "現場咁混亂，佢撞到餐檯又算落我度？你哋而家擺明係夾埋想叫我食死貓囉！",
                    text_en: "The scene was so chaotic, if he bumped into a dining table does that count on me too? You guys are clearly teaming up to make me swallow the false blame!",
                    targetText_zh: "現場咁混亂，佢撞到餐檯又算落我度？你哋而家擺明係夾埋想叫我食死貓囉！",
                    targetText_en: "The scene was so chaotic, if he bumped into a dining table does that count on me too? You guys are clearly teaming up to make me swallow the false blame!"
                },
                {
                    turn: 9, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "Two uniform police officers quickly arrived at the scene. PC 14285 ordered you to calm down and produce your identity card, right?",
                    text_en: "Two uniform police officers quickly arrived at the scene. PC 14285 ordered you to calm down and produce your identity card, right?",
                    targetText_zh: "兩名軍裝警員好快到達現場。警員14285命令你冷靜同埋出示身分證，啱唔啱？",
                    targetText_en: "Two uniform police officers quickly arrived at the scene. PC 14285 ordered you to calm down and produce your identity card, right?"
                },
                {
                    turn: 10, role_zh: "被告 (郭先生)", role_en: "Defendant (Mr. Kwok)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "佢哋一嚟到問都唔問就老屈我打人，態度不知幾差，我點解要無端端畀身分證佢？",
                    text_en: "As soon as they arrived they wrongly accused me of assault without even asking. Their attitude was terribly bad, why should I give him my ID card for no reason?",
                    targetText_zh: "佢哋一嚟到問都唔問就老屈我打人，態度不知幾差，我點解要無端端畀身分證佢？",
                    targetText_en: "As soon as they arrived they wrongly accused me of assault without even asking. Their attitude was terribly bad, why should I give him my ID card for no reason?"
                },
                {
                    turn: 11, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "I suggest to you that you refused to cooperate and shouted, 'Police officers are bullying people!' to incite the surrounding crowd.",
                    text_en: "I suggest to you that you refused to cooperate and shouted, 'Police officers are bullying people!' to incite the surrounding crowd.",
                    targetText_zh: "我向你指出，你拒絕合作，仲大嗌「警察蝦人！」嚟煽動周圍嘅圍觀群眾。",
                    targetText_en: "I suggest to you that you refused to cooperate and shouted, 'Police officers are bullying people!' to incite the surrounding crowd."
                },
                {
                    turn: 12, role_zh: "被告 (郭先生)", role_en: "Defendant (Mr. Kwok)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "我講事實咋嘛！大石砸死蟹呀？差人好巴閉呀？明明係我被人挑釁在先！",
                    text_en: "I was only stating the facts! Are the powerful crushing the weak? Are cops that big a deal? Clearly it was me being provoked first!",
                    targetText_zh: "我講事實咋嘛！大石砸死蟹呀？差人好巴閉呀？明明係我被人挑釁在先！",
                    targetText_en: "I was only stating the facts! Are the powerful crushing the weak? Are cops that big a deal? Clearly it was me being provoked first!"
                },
                {
                    turn: 13, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "When PC 14285 attempted to hold your right arm, you violently struggled and pushed him against the glass door.",
                    text_en: "When PC 14285 attempted to hold your right arm, you violently struggled and pushed him against the glass door.",
                    targetText_zh: "當警員14285嘗試拉住你右臂嗰陣，你激烈掙扎，仲將佢推向玻璃門。",
                    targetText_en: "When PC 14285 attempted to hold your right arm, you violently struggled and pushed him against the glass door."
                },
                {
                    turn: 14, role_zh: "被告 (郭先生)", role_en: "Defendant (Mr. Kwok)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "絕對冇！佢無啦啦撲過嚟想撳低我，我身體失平衡先至撞埋玻璃門，根本唔係我主動推佢！",
                    text_en: "Absolutely not! He pounced over out of nowhere trying to pin me down. I lost my balance and bumped into the glass door; it was not me taking the initiative to push him at all!",
                    targetText_zh: "絕對冇！佢無啦啦撲過嚟想撳低我，我身體失平衡先至撞埋玻璃門，根本唔係我主動推佢！",
                    targetText_en: "Absolutely not! He pounced over out of nowhere trying to pin me down. I lost my balance and bumped into the glass door; it was not me taking the initiative to push him at all!"
                },
                {
                    turn: 15, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "Do you agree that it eventually required three officers to subdue you and put handcuffs on you?",
                    text_en: "Do you agree that it eventually required three officers to subdue you and put handcuffs on you?",
                    targetText_zh: "你同唔同意最終需要三名警員合力先至將你制服同埋戴上手銬？",
                    targetText_en: "Do you agree that it eventually required three officers to subdue you and put handcuffs on you?"
                },
                {
                    turn: 16, role_zh: "被告 (郭先生)", role_en: "Defendant (Mr. Kwok)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "同意，嗰三個大隻佬夾硬撳到我塊面貼地，我成隻手臂痛到痹晒，屈得就屈囉！",
                    text_en: "I agree. Those three big muscular men forcibly pinned my face to the floor. My whole arm was in excruciating pain and went numb. They were just framing me arbitrarily!",
                    targetText_zh: "同意，嗰三個大隻佬夾硬撳到我塊面貼地，我成隻手臂痛到痹晒，屈得就屈囉！",
                    targetText_en: "I agree. Those three big muscular men forcibly pinned my face to the floor. My whole arm was in excruciating pain and went numb. They were just framing me arbitrarily!"
                },
                {
                    turn: 17, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "I challenge your assertion that you were merely defending yourself. You were agitated and deliberately aggressive throughout the encounter.",
                    text_en: "I challenge your assertion that you were merely defending yourself. You were agitated and deliberately aggressive throughout the encounter.",
                    targetText_zh: "我對你話純粹自衛嘅講法提出質疑。喺成個過程入面，你情緒非常激動，而且係蓄意採取攻擊性行為。",
                    targetText_en: "I challenge your assertion that you were merely defending yourself. You were agitated and deliberately aggressive throughout the encounter."
                },
                {
                    turn: 18, role_zh: "被告 (郭先生)", role_en: "Defendant (Mr. Kwok)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "你問我我問邊個呀？畀人無端端打、跟住又畀人撳地，換著係你，你激唔激動呀？",
                    text_en: "How would I know? If you were beaten for no reason and then pinned to the ground, wouldn't you be agitated if you were in my shoes?",
                    targetText_zh: "你問我我問邊個呀？畀人無端端打、跟住又畀人撳地，換著係你，你激唔激動呀？",
                    targetText_en: "How would I know? If you were beaten for no reason and then pinned to the ground, wouldn't you be agitated if you were in my shoes?"
                },
                {
                    turn: 19, role_zh: "主控官", role_en: "Prosecutor", gender: "male", lang: "en-US",
                    text_zh: "I put it to you finally: you assaulted Mr. Lee without justification, and you wilfully resisted a police officer acting in the due execution of his duty.",
                    text_en: "I put it to you finally: you assaulted Mr. Lee without justification, and you wilfully resisted a police officer acting in the due execution of his duty.",
                    targetText_zh: "等我最後向你指出：你喺毫無合理辯解之下襲擊李先生，而且蓄意抗拒正當執行職務嘅警務人員。",
                    targetText_en: "I put it to you finally: you assaulted Mr. Lee without justification, and you wilfully resisted a police officer acting in the due execution of his duty."
                },
                {
                    turn: 20, role_zh: "被告 (郭先生)", role_en: "Defendant (Mr. Kwok)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "我絕對唔同意！我句句實話，根本係佢哋砌我生豬肉，我問心無愧！",
                    text_en: "I absolutely disagree! Every word of mine is true. They are simply framing me up, and I have a clear conscience!",
                    targetText_zh: "我絕對唔同意！我句句實話，根本係佢哋砌我生豬肉，我問心無愧！",
                    targetText_en: "I absolutely disagree! Every word of mine is true. They are simply framing me up, and I have a clear conscience!"
                }
            ]
        },

        // ====================================================================
        // Case 3: 勞資審裁處 Level 2 (常規實戰) · 技術數據與代通知金 (已修正稱呼為「被告」)
        // ====================================================================
        {
            id: "preset_tribunal_labour_l2",
            title_zh: "勞資審裁處 ➜ [Level 2 技術專家與算式] 解僱代通知金及超時工作津貼申索案 (LBTC 304/2026)",
            title_en: "Labour Tribunal ➜ [Level 2 Technical & Accounting] Wages in Lieu of Notice Claim (LBTC 304/2026)",
            category: "civil",
            venue: "tribunal",
            difficulty: 2,
            persona: "technical_tribunal",
            voice_config: {
                counsel_gender: "female",
                witness_gender: "male",
                witness_age_group: "adult"
            },
            desc_zh: "專為審裁處（Tribunals）設計的非對抗式民事審裁練習。發問方為審裁官（Presiding Officer），作答方為申索人（廚師）。口譯中直接稱呼對造公司為「被告（Defendant）」。重點考驗代通知金（Wages in lieu of notice）、平均日薪計算公式及考勤打卡紀錄的精準口譯。",
            desc_en: "Inquisitorial civil adjudication at the Labour Tribunal. Features the Presiding Officer examining the Claimant regarding summary dismissal, wages in lieu of notice, and overtime pay formulas.",
            cls_guidelines: "1. 審裁處專用語：'Presiding Officer' -> 「審裁官」；'Claimant' -> 「申索人」；對造公司口語直稱「被告 (Defendant)」\n2. 法定名詞：'wages in lieu of notice' -> 「代通知金」；'summary dismissal' -> 「即時解僱」\n3. 薪酬數字：底薪$22,000、代通知金$22,000、加班費每小時$95、總額$31,500必須精準無誤。",
            dialogue: [
                {
                    turn: 1, role_zh: "審裁官", role_en: "Presiding Officer", gender: "female", lang: "en-US",
                    text_zh: "Mr. Cheung, you are claiming against the Defendant company for one month's wages in lieu of notice and 100 hours of overtime pay, is that correct?",
                    text_en: "Mr. Cheung, you are claiming against the Defendant company for one month's wages in lieu of notice and 100 hours of overtime pay, is that correct?",
                    targetText_zh: "張先生，你向被告公司申索一個月嘅代通知金同埋一百個鐘頭嘅超時工作津貼，係咪？",
                    targetText_en: "Mr. Cheung, you are claiming against the Defendant company for one month's wages in lieu of notice and 100 hours of overtime pay, is that correct?"
                },
                {
                    turn: 2, role_zh: "申索人 (張先生)", role_en: "Claimant (Mr. Cheung)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "係，審裁官。我喺嗰間酒樓做咗兩年點心師傅，合約寫明每個月底薪係兩萬二千蚊。",
                    text_en: "Yes, Presiding Officer. I worked as a dim sum chef at that restaurant for two years, and the contract clearly stipulated a monthly basic salary of 22,000 dollars.",
                    targetText_zh: "係，審裁官。我喺嗰間酒樓做咗兩年點心師傅，合約寫明每個月底薪係兩萬二千蚊。",
                    targetText_en: "Yes, Presiding Officer. I worked as a dim sum chef at that restaurant for two years, and the contract clearly stipulated a monthly basic salary of 22,000 dollars."
                },
                {
                    turn: 3, role_zh: "審裁官", role_en: "Presiding Officer", gender: "female", lang: "en-US",
                    text_zh: "According to Clause 8 of your employment contract, either party may terminate the employment by giving one month's notice or by paying one month's wages in lieu.",
                    text_en: "According to Clause 8 of your employment contract, either party may terminate the employment by giving one month's notice or by paying one month's wages in lieu.",
                    targetText_zh: "根據你僱傭合約第8條，任何一方可以畀一個月通知期，或者支付一個月代通知金嚟終止僱傭關係。",
                    targetText_en: "According to Clause 8 of your employment contract, either party may terminate the employment by giving one month's notice or by paying one month's wages in lieu."
                },
                {
                    turn: 4, role_zh: "申索人 (張先生)", role_en: "Claimant (Mr. Cheung)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "冇錯，但被告喺2月28號突然即日叫我走，一毫子代通知金都唔肯畀。",
                    text_en: "That is correct, but on 28th February the Defendant suddenly told me to leave on the same day, refusing to pay even a single cent of wages in lieu of notice.",
                    targetText_zh: "冇錯，但被告喺2月28號突然即日叫我走，一毫子代通知金都唔肯畀。",
                    targetText_en: "That is correct, but on 28th February the Defendant suddenly told me to leave on the same day, refusing to pay even a single cent of wages in lieu of notice."
                },
                {
                    turn: 5, role_zh: "審裁官", role_en: "Presiding Officer", gender: "female", lang: "en-US",
                    text_zh: "The Defendant alleges that you committed gross misconduct by repeatedly arriving late and engaging in verbal disputes with the head chef, which justified summary dismissal.",
                    text_en: "The Defendant alleges that you committed gross misconduct by repeatedly arriving late and engaging in verbal disputes with the head chef, which justified summary dismissal.",
                    targetText_zh: "被告指稱你多次遲到，而且同大廚發生言語爭執，構成嚴重不當行為，所以有合理理由將你即時解僱。",
                    targetText_en: "The Defendant alleges that you committed gross misconduct by repeatedly arriving late and engaging in verbal disputes with the head chef, which justified summary dismissal."
                },
                {
                    turn: 6, role_zh: "申索人 (張先生)", role_en: "Claimant (Mr. Cheung)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "我唔同意。我所謂遲到只係五至十分鐘，而且我從來冇收過公司任何書面警告信。",
                    text_en: "I disagree. My so-called lateness was only 5 to 10 minutes, and I had never received any written warning letters from the company.",
                    targetText_zh: "我唔同意。我所謂遲到只係五至十分鐘，而且我從來冇收過公司任何書面警告信。",
                    targetText_en: "I disagree. My so-called lateness was only 5 to 10 minutes, and I had never received any written warning letters from the company."
                },
                {
                    turn: 7, role_zh: "審裁官", role_en: "Presiding Officer", gender: "female", lang: "en-US",
                    text_zh: "Let's turn to your overtime claim. You are claiming 100 hours at an hourly rate of 95 dollars, totaling 9,500 dollars, is that right?",
                    text_en: "Let's turn to your overtime claim. You are claiming 100 hours at an hourly rate of 95 dollars, totaling 9,500 dollars, is that right?",
                    targetText_zh: "我哋轉去睇你嘅超時工作津貼申索。你申索按每小時95蚊計算嘅100個鐘頭，總數係9,500蚊，係咪？",
                    targetText_en: "Let's turn to your overtime claim. You are claiming 100 hours at an hourly rate of 95 dollars, totaling 9,500 dollars, is that right?"
                },
                {
                    turn: 8, role_zh: "申索人 (張先生)", role_en: "Claimant (Mr. Cheung)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "係，每逢農曆新年同長假期，我哋廚房每晚都要開OT做盆菜，做到通宵達旦。",
                    text_en: "Yes. During Lunar New Year and long public holidays, our kitchen staff had to work overtime every night making poon choi, working through the night.",
                    targetText_zh: "係，每逢農曆新年同長假期，我哋廚房每晚都要開OT做盆菜，做到通宵達旦。",
                    targetText_en: "Yes. During Lunar New Year and long public holidays, our kitchen staff had to work overtime every night making poon choi, working through the night."
                },
                {
                    turn: 9, role_zh: "審裁官", role_en: "Presiding Officer", gender: "female", lang: "en-US",
                    text_zh: "I have examined Exhibit C1, your punch-card records for December and January. However, many overtime entries lack the manager's countersignature.",
                    text_en: "I have examined Exhibit C1, your punch-card records for December and January. However, many overtime entries lack the manager's countersignature.",
                    targetText_zh: "我檢閱過證物C1，即係你喺12月同1月嘅打卡紀錄。但係有好多處超時紀錄都冇經理嘅副署簽名。",
                    targetText_en: "I have examined Exhibit C1, your punch-card records for December and January. However, many overtime entries lack the manager's countersignature."
                },
                {
                    turn: 10, role_zh: "申索人 (張先生)", role_en: "Claimant (Mr. Cheung)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "因為經理成日話好忙，口頭叫我哋打咗卡先，話遲啲會補簽，點知最後唔認數！",
                    text_en: "Because the manager always claimed to be very busy, verbally told us to punch the card first and promised to sign later, but in the end he went back on his word!",
                    targetText_zh: "因為經理成日話好忙，口頭叫我哋打咗卡先，話遲啲會補簽，點知最後唔認數！",
                    targetText_en: "Because the manager always claimed to be very busy, verbally told us to punch the card first and promised to sign later, but in the end he went back on his word!"
                },
                {
                    turn: 11, role_zh: "審裁官", role_en: "Presiding Officer", gender: "female", lang: "en-US",
                    text_zh: "Under Section 9 of the Employment Ordinance, summary dismissal is only permitted in cases of habitual neglect of duties or willful disobedience.",
                    text_en: "Under Section 9 of the Employment Ordinance, summary dismissal is only permitted in cases of habitual neglect of duties or willful disobedience.",
                    targetText_zh: "根據《僱傭條例》第9條，只有喺慣常疏忽職責或者故意不服從合法命令嘅情況下，先至容許即時解僱。",
                    targetText_en: "Under Section 9 of the Employment Ordinance, summary dismissal is only permitted in cases of habitual neglect of duties or willful disobedience."
                },
                {
                    turn: 12, role_zh: "申索人 (張先生)", role_en: "Claimant (Mr. Cheung)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "審裁官，我絕對冇疏忽職守，我一直盡忠職守，被告完全冇法律理據炒我魷魚。",
                    text_en: "Presiding Officer, I definitely did not neglect my duties. I have always been conscientious, and the Defendant had absolutely no legal basis to fire me.",
                    targetText_zh: "審裁官，我絕對冇疏忽職守，我一直盡忠職守，被告完全冇法律理據炒我魷魚。",
                    targetText_en: "Presiding Officer, I definitely did not neglect my duties. I have always been conscientious, and the Defendant had absolutely no legal basis to fire me."
                },
                {
                    turn: 13, role_zh: "審裁官", role_en: "Presiding Officer", gender: "female", lang: "en-US",
                    text_zh: "The Defendant has produced a WhatsApp screenshot showing that you were given a verbal reprimand on 15th January regarding food hygiene.",
                    text_en: "The Defendant has produced a WhatsApp screenshot showing that you were given a verbal reprimand on 15th January regarding food hygiene.",
                    targetText_zh: "被告呈交咗一張WhatsApp對話截圖，顯示喺1月15號，你曾經因為食物衛生問題被口頭訓誡。",
                    targetText_en: "The Defendant has produced a WhatsApp screenshot showing that you were given a verbal reprimand on 15th January regarding food hygiene."
                },
                {
                    turn: 14, role_zh: "申索人 (張先生)", role_en: "Claimant (Mr. Cheung)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "嗰次係雪櫃壞咗搞到食材變質，根本係公司保養不善，完全唔關我個人廚藝事。",
                    text_en: "That time was due to a broken refrigerator causing food spoilage; it was purely the company's poor maintenance and had nothing to do with my culinary skills.",
                    targetText_zh: "嗰次係雪櫃壞咗搞到食材變質，根本係公司保養不善，完全唔關我個人廚藝事。",
                    targetText_en: "That time was due to a broken refrigerator causing food spoilage; it was purely the company's poor maintenance and had nothing to do with my culinary skills."
                },
                {
                    turn: 15, role_zh: "審裁官", role_en: "Presiding Officer", gender: "female", lang: "en-US",
                    text_zh: "If summary dismissal is not substantiated, you are legally entitled to 22,000 dollars as wages in lieu of notice.",
                    text_en: "If summary dismissal is not substantiated, you are legally entitled to 22,000 dollars as wages in lieu of notice.",
                    targetText_zh: "如果即時解僱嘅理由唔成立，你喺法律上有權獲得二萬二千蚊作為代通知金。",
                    targetText_en: "If summary dismissal is not substantiated, you are legally entitled to 22,000 dollars as wages in lieu of notice."
                },
                {
                    turn: 16, role_zh: "申索人 (張先生)", role_en: "Claimant (Mr. Cheung)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "明白，我堅持追討呢筆代通知金，同埋嗰九千五百蚊嘅血汗加班錢。",
                    text_en: "Understood. I insist on claiming this sum of wages in lieu of notice, as well as those 9,500 dollars of hard-earned overtime pay.",
                    targetText_zh: "明白，我堅持追討呢筆代通知金，同埋嗰九千五百蚊嘅血汗加班錢。",
                    targetText_en: "Understood. I insist on claiming this sum of wages in lieu of notice, as well as those 9,500 dollars of hard-earned overtime pay."
                },
                {
                    turn: 17, role_zh: "審裁官", role_en: "Presiding Officer", gender: "female", lang: "en-US",
                    text_zh: "Regarding the overtime claim, without the manager's signature, what independent evidence do you have to prove you worked those 100 extra hours?",
                    text_en: "Regarding the overtime claim, without the manager's signature, what independent evidence do you have to prove you worked those 100 extra hours?",
                    targetText_zh: "關於超時工作津貼申索，喺冇經理簽名嘅情況下，你有咩獨立證據去證明你確實做咗嗰100個額外鐘頭？",
                    targetText_en: "Regarding the overtime claim, without the manager's signature, what independent evidence do you have to prove you worked those 100 extra hours?"
                },
                {
                    turn: 18, role_zh: "申索人 (張先生)", role_en: "Claimant (Mr. Cheung)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "我有廚房WhatsApp群組嘅落單紀錄，同埋每日收工搭深夜的士嘅收據做證。",
                    text_en: "I have kitchen WhatsApp group order logs and receipts from taking late-night taxis after work every day as evidence.",
                    targetText_zh: "我有廚房WhatsApp群組嘅落單紀錄，同埋每日收工搭深夜的士嘅收據做證。",
                    targetText_en: "I have kitchen WhatsApp group order logs and receipts from taking late-night taxis after work every day as evidence."
                },
                {
                    turn: 19, role_zh: "審裁官", role_en: "Presiding Officer", gender: "female", lang: "en-US",
                    text_zh: "Very well. Both parties are encouraged to attempt conciliation today for an aggregate settlement sum of 26,000 dollars.",
                    text_en: "Very well. Both parties are encouraged to attempt conciliation today for an aggregate settlement sum of 26,000 dollars.",
                    targetText_zh: "好好。我鼓勵雙方今日嘗試和解，以總和解金額二萬六千蚊去解決爭議。",
                    targetText_en: "Very well. Both parties are encouraged to attempt conciliation today for an aggregate settlement sum of 26,000 dollars."
                },
                {
                    turn: 20, role_zh: "申索人 (張先生)", role_en: "Claimant (Mr. Cheung)", gender: "male", age_group: "adult", lang: "zh-HK",
                    text_zh: "如果被告肯即場開支票畀二萬六千蚊，我願意接受和解並銷案。",
                    text_en: "If the Defendant is willing to issue a cheque for 26,000 dollars on the spot, I am willing to accept the settlement and withdraw the claim.",
                    targetText_zh: "如果被告肯即場開支票畀二萬六千蚊，我願意接受和解並銷案。",
                    targetText_en: "If the Defendant is willing to issue a cheque for 26,000 dollars on the spot, I am willing to accept the settlement and withdraw the claim."
                }
            ]
        },

        // ====================================================================
        // Case 4: 裁判法院 Level 2 (常規實戰) · 長者囉嗦迂迴證人非禮案
        // ====================================================================
        {
            id: "preset_mag_elderly_l2",
            title_zh: "裁判法院 ➜ [Level 2 長者囉嗦證人] 屋邨小巴非禮及口角案 (FLCC 412/2026)",
            title_en: "Magistrates' Courts ➜ [Level 2 Elderly Persona] Minibus Indecent Assault (FLCC 412/2026)",
            category: "criminal",
            venue: "magistrates",
            difficulty: 2,
            persona: "elderly_garrulous",
            voice_config: {
                counsel_gender: "male",
                witness_gender: "female",
                witness_age_group: "elderly"
            },
            desc_zh: "專門考核初級傳譯主任「耐性與禁止擅自精簡供詞（No Unauthorized Summarization）」原則。70歲長者女證人敘事極度囉嗦迂迴，夾雜買餸、覆診等瑣事。辯方大律師質疑其年邁老花看錯。考驗傳譯員在雜亂資訊中忠實還原原貌。",
            desc_en: "Designed to train stamina against circumstantial rambling witnesses. A 70-year-old female victim recounts an alleged touching on a green minibus. Tests faithful rendition without unauthorized summarization.",
            cls_guidelines: "1. 嚴禁傳譯員擅自幫證人縮減摘要（Unauthorized Summarization），長者所有看似無關的細節必須全數譯出。\n2. 盤問格式語：'I challenge your assertion' -> 「我對你嘅說法提出質疑」\n3. 專用語：'indecent assault' -> 「非禮」；'presbyopia' -> 「老花眼」\n4. 時間數字：70歲、綠色專線小巴501K、朝早八點十五分。",
            dialogue: [
                {
                    turn: 1, role_zh: "辯方大律師", role_en: "Defense Counsel", gender: "male", lang: "en-US",
                    text_zh: "Madam Wong, at the material time on 16th February 2026, you boarded the green minibus route 501K at Fanling Station, correct?",
                    text_en: "Madam Wong, at the material time on 16th February 2026, you boarded the green minibus route 501K at Fanling Station, correct?",
                    targetText_zh: "黃女士，喺案發嗰陣，即係2026年2月16號，你喺粉嶺站上咗架501K綠色專線小巴，係咪？",
                    targetText_en: "Madam Wong, at the material time on 16th February 2026, you boarded the green minibus route 501K at Fanling Station, correct?"
                },
                {
                    turn: 2, role_zh: "事主 (黃婆婆)", role_en: "Victim (Madam Wong)", gender: "female", age_group: "elderly", lang: "zh-HK",
                    text_zh: "係呀大律師，嗰朝早天矇光，我約咗去聯和墟街市買條鯇魚煮畀我個孫食，大約八點三個字度就上咗車囉。",
                    text_en: "Yes, Counsel. It was just dawn that morning. I had an appointment to go to Luen Wo Hui Market to buy a grass carp to cook for my grandson, and I got on the bus at around 8:15 a.m.",
                    targetText_zh: "係呀大律師，嗰朝早天矇光，我約咗去聯和墟街市買條鯇魚煮畀我個孫食，大約八點三個字度就上咗車囉。",
                    targetText_en: "Yes, Counsel. It was just dawn that morning. I had an appointment to go to Luen Wo Hui Market to buy a grass carp to cook for my grandson, and I got on the bus at around 8:15 a.m."
                },
                {
                    turn: 3, role_zh: "辯方大律師", role_en: "Defense Counsel", gender: "male", lang: "en-US",
                    text_zh: "You sat in the single seat on the left side of the minibus, while the defendant sat in the double seat across the aisle, is that right?",
                    text_en: "You sat in the single seat on the left side of the minibus, while the defendant sat in the double seat across the aisle, is that right?",
                    targetText_zh: "你坐喺小巴左邊嘅單人位，而被告人就坐喺隔住條走廊嘅雙人位，啱唔啱？",
                    targetText_en: "You sat in the single seat on the left side of the minibus, while the defendant sat in the double seat across the aisle, is that right?"
                },
                {
                    turn: 4, role_zh: "事主 (黃婆婆)", role_en: "Victim (Madam Wong)", gender: "female", age_group: "elderly", lang: "zh-HK",
                    text_zh: "啱，我平時腳痛開，坐單人位方便我擺個拉記車仔，嗰個男人就坐喺我右手邊對開嗰度囉。",
                    text_en: "Correct. I usually suffer from leg pain, so sitting in a single seat makes it easier for me to put my trolley bag. That man was sitting right across on my right-hand side.",
                    targetText_zh: "啱，我平時腳痛開，坐單人位方便我擺個拉記車仔，嗰個男人就坐喺我右手邊對開嗰度囉。",
                    targetText_en: "Correct. I usually suffer from leg pain, so sitting in a single seat makes it easier for me to put my trolley bag. That man was sitting right across on my right-hand side."
                },
                {
                    turn: 5, role_zh: "辯方大律師", role_en: "Defense Counsel", gender: "male", lang: "en-US",
                    text_zh: "You claim that while the minibus was travelling along Sha Tau Kok Road, you felt a hand touch your right knee, correct?",
                    text_en: "You claim that while the minibus was travelling along Sha Tau Kok Road, you felt a hand touch your right knee, correct?",
                    targetText_zh: "你聲稱當小巴沿住沙頭角公路行駛嗰陣，你感覺到有隻手摸你嘅右邊膝頭，係咪？",
                    targetText_en: "You claim that while the minibus was travelling along Sha Tau Kok Road, you felt a hand touch your right knee, correct?"
                },
                {
                    turn: 6, role_zh: "事主 (黃婆婆)", role_en: "Victim (Madam Wong)", gender: "female", age_group: "elderly", lang: "zh-HK",
                    text_zh: "唔單止摸膝頭呀！隻手仲格硬向上摸到我大髀肉度，摸咗成兩三秒咁耐，好核突㗎！",
                    text_en: "Not only touching the knee! That hand even forcibly moved upwards and touched the flesh of my thigh, touching for as long as two to three seconds. It was so disgusting!",
                    targetText_zh: "唔單止摸膝頭呀！隻手仲格硬向上摸到我大髀肉度，摸咗成兩三秒咁耐，好核突㗎！",
                    targetText_en: "Not only touching the knee! That hand even forcibly moved upwards and touched the flesh of my thigh, touching for as long as two to three seconds. It was so disgusting!"
                },
                {
                    turn: 7, role_zh: "辯方大律師", role_en: "Defense Counsel", gender: "male", lang: "en-US",
                    text_zh: "I suggest to you that the minibus was swerving violently due to road maintenance, and the defendant merely lost his balance and reached out to steady himself.",
                    text_en: "I suggest to you that the minibus was swerving violently due to road maintenance, and the defendant merely lost his balance and reached out to steady himself.",
                    targetText_zh: "我向你指出，因為當時有道路工程，小巴劇烈搖晃，被告人只不過係失去平衡先至伸手扶穩自己。",
                    targetText_en: "I suggest to you that the minibus was swerving violently due to road maintenance, and the defendant merely lost his balance and reached out to steady himself."
                },
                {
                    turn: 8, role_zh: "事主 (黃婆婆)", role_en: "Victim (Madam Wong)", gender: "female", age_group: "elderly", lang: "zh-HK",
                    text_zh: "邊有啲噉嘅事！我幾十歲人點會唔識分扶手同摸大髀呀？佢隻手掌係停喺我條肉度捏咗兩下呀！",
                    text_en: "No such thing! I am in my seventies, how could I not tell the difference between holding a handrail and groping a thigh? His palm stayed on my flesh and squeezed twice!",
                    targetText_zh: "邊有啲噉嘅事！我幾十歲人點會唔識分扶手同摸大髀呀？佢隻手掌係停喺我條肉度捏咗兩下呀！",
                    targetText_en: "No such thing! I am in my seventies, how could I not tell the difference between holding a handrail and groping a thigh? His palm stayed on my flesh and squeezed twice!"
                },
                {
                    turn: 9, role_zh: "辯方大律師", role_en: "Defense Counsel", gender: "male", lang: "en-US",
                    text_zh: "Madam Wong, you are 70 years old, suffer from serious presbyopia, and you were not wearing your reading glasses at the material time, were you?",
                    text_en: "Madam Wong, you are 70 years old, suffer from serious presbyopia, and you were not wearing your reading glasses at the material time, were you?",
                    targetText_zh: "黃女士，你已經70歲，有嚴重老花，而且喺案發嗰陣你並無戴住老花眼鏡，係咪？",
                    targetText_en: "Madam Wong, you are 70 years old, suffer from serious presbyopia, and you were not wearing your reading glasses at the material time, were you?"
                },
                {
                    turn: 10, role_zh: "事主 (黃婆婆)", role_en: "Victim (Madam Wong)", gender: "female", age_group: "elderly", lang: "zh-HK",
                    text_zh: "我睇報紙先要戴眼鏡咋嘛！兩呎之內咁大個活人伸隻手過嚟，唔通我都睇唔到咩？我眼矇心唔矇呀！",
                    text_en: "I only need to wear glasses when reading newspapers! Within two feet, such a big living person stretching his hand over, how could I possibly not see it? My vision may be blurred, but my mind is crystal clear!",
                    targetText_zh: "我睇報紙先要戴眼鏡咋嘛！兩呎之內咁大個活人伸隻手過嚟，唔通我都睇唔到咩？我眼矇心唔矇呀！",
                    targetText_en: "I only need to wear glasses when reading newspapers! Within two feet, such a big living person stretching his hand over, how could I possibly not see it? My vision may be blurred, but my mind is crystal clear!"
                },
                {
                    turn: 11, role_zh: "辯方大律師", role_en: "Defense Counsel", gender: "male", lang: "en-US",
                    text_zh: "According to the driver's statement, the passenger sitting directly behind you was carrying a large plastic bag containing frozen meat.",
                    text_en: "According to the driver's statement, the passenger sitting directly behind you was carrying a large plastic bag containing frozen meat.",
                    targetText_zh: "根據司機嘅供詞，坐喺你正後方嘅乘客攜帶著一個裝住凍肉嘅大型膠袋。",
                    targetText_en: "According to the driver's statement, the passenger sitting directly behind you was carrying a large plastic bag containing frozen meat."
                },
                {
                    turn: 12, role_zh: "事主 (黃婆婆)", role_en: "Victim (Madam Wong)", gender: "female", age_group: "elderly", lang: "zh-HK",
                    text_zh: "嗰個膠袋凍冰冰，摸我大髀隻手暖粒粒仲有手指關節，點會係膠袋？你唔好當我老人家好恰先得㗎！",
                    text_en: "That plastic bag was ice-cold, whereas the hand touching my thigh was warm and had knuckles. How could it be a plastic bag? You must not take advantage of me as an elderly person!",
                    targetText_zh: "嗰個膠袋凍冰冰，摸我大髀隻手暖粒粒仲有手指關節，點會係膠袋？你唔好當我老人家好恰先得㗎！",
                    targetText_en: "That plastic bag was ice-cold, whereas the hand touching my thigh was warm and had knuckles. How could it be a plastic bag? You must not take advantage of me as an elderly person!"
                },
                {
                    turn: 13, role_zh: "辯方大律師", role_en: "Defense Counsel", gender: "male", lang: "en-US",
                    text_zh: "Do you agree that when you shouted at the defendant, he immediately denied touching you and stated that his hands were holding his mobile phone?",
                    text_en: "Do you agree that when you shouted at the defendant, he immediately denied touching you and stated that his hands were holding his mobile phone?",
                    targetText_zh: "你同唔同意當你向被告人喝止嗰陣，佢即時否認摸過你，仲話佢對手當時係揸住部手機？",
                    targetText_en: "Do you agree that when you shouted at the defendant, he immediately denied touching you and stated that his hands were holding his mobile phone?"
                },
                {
                    turn: 14, role_zh: "事主 (黃婆婆)", role_en: "Victim (Madam Wong)", gender: "female", age_group: "elderly", lang: "zh-HK",
                    text_zh: "同意，做賊嘅邊個會認賊呀？佢面都紅晒，一邊收埋部電話一邊閃閃縮縮囉！",
                    text_en: "I agree. What thief would admit being a thief? His face blushed completely, and he acted evasively while putting away his phone!",
                    targetText_zh: "同意，做賊嘅邊個會認賊呀？佢面都紅晒，一邊收埋部電話一邊閃閃縮縮囉！",
                    targetText_en: "I agree. What thief would admit being a thief? His face blushed completely, and he acted evasively while putting away his phone!"
                },
                {
                    turn: 15, role_zh: "辯方大律師", role_en: "Defense Counsel", gender: "male", lang: "en-US",
                    text_zh: "Is it your evidence that the defendant attempted to alight from the minibus before the police arrived?",
                    text_en: "Is it your evidence that the defendant attempted to alight from the minibus before the police arrived?",
                    targetText_zh: "你嘅證供係咪話，被告人喺警察嚟到之前曾經企圖落車？",
                    targetText_en: "Is it your evidence that the defendant attempted to alight from the minibus before the police arrived?"
                },
                {
                    turn: 16, role_zh: "事主 (黃婆婆)", role_en: "Victim (Madam Wong)", gender: "female", age_group: "elderly", lang: "zh-HK",
                    text_zh: "係呀！佢係噉叫司機開門話要返工，好彩司機同成班街坊幫我頂住個門口唔畀佢走咋！",
                    text_en: "Yes! He kept telling the driver to open the door claiming he had to go to work. Luckily, the driver and the passengers helped me block the door to stop him from leaving!",
                    targetText_zh: "係呀！佢係噉叫司機開門話要返工，好彩司機同成班街坊幫我頂住個門口唔畀佢走咋！",
                    targetText_en: "Yes! He kept telling the driver to open the door claiming he had to go to work. Luckily, the driver and the passengers helped me block the door to stop him from leaving!"
                },
                {
                    turn: 17, role_zh: "辯方大律師", role_en: "Defense Counsel", gender: "male", lang: "en-US",
                    text_zh: "I challenge your assertion. The defendant had an urgent business meeting in Sheung Shui at 9:00 a.m., which explained his anxiety to leave.",
                    text_en: "I challenge your assertion. The defendant had an urgent business meeting in Sheung Shui at 9:00 a.m., which explained his anxiety to leave.",
                    targetText_zh: "我對你嘅說法提出質疑。被告人當時喺朝早九點喺上水有個緊急商務會議，呢點解釋咗佢點解急於離開。",
                    targetText_en: "I challenge your assertion. The defendant had an urgent business meeting in Sheung Shui at 9:00 a.m., which explained his anxiety to leave."
                },
                {
                    turn: 18, role_zh: "事主 (黃婆婆)", role_en: "Victim (Madam Wong)", gender: "female", age_group: "elderly", lang: "zh-HK",
                    text_zh: "開會大晒呀？開會就可以無啦啦伸隻手過嚟摸阿婆大髀呀？做錯事就要承擔責任！",
                    text_en: "Does having a meeting make you above everything? Does having a meeting entitle you to reach over and grope an elderly lady's thigh? If you do wrong, you must take responsibility!",
                    targetText_zh: "開會大晒呀？開會就可以無啦啦伸隻手過嚟摸阿婆大髀呀？做錯事就要承擔責任！",
                    targetText_en: "Does having a meeting make you above everything? Does having a meeting entitle you to reach over and grope an elderly lady's thigh? If you do wrong, you must take responsibility!"
                },
                {
                    turn: 19, role_zh: "辯方大律師", role_en: "Defense Counsel", gender: "male", lang: "en-US",
                    text_zh: "I put it to you that the contact was purely accidental caused by the vehicle's motion, and your allegation of indecent assault is a mistaken invention.",
                    text_en: "I put it to you that the contact was purely accidental caused by the vehicle's motion, and your allegation of indecent assault is a mistaken invention.",
                    targetText_zh: "我向你指出，嗰次身體接觸純粹係車輛晃動造成嘅意外，而你對非禮嘅指控只係一場誤會嘅捏造。",
                    targetText_en: "I put it to you that the contact was purely accidental caused by the vehicle's motion, and your allegation of indecent assault is a mistaken invention."
                },
                {
                    turn: 20, role_zh: "事主 (黃婆婆)", role_en: "Victim (Madam Wong)", gender: "female", age_group: "elderly", lang: "zh-HK",
                    text_zh: "我對住天發誓絕對冇冤枉佢！佢明明就係存心抽水，我雖然年紀大，但句句真話！",
                    text_en: "I swear to Heaven that I definitely did not wrongly accuse him! He was obviously taking advantage of me intentionally. Although I am old, every word is the truth!",
                    targetText_zh: "我對住天發誓絕對冇冤枉佢！佢明明就係存心抽水，我雖然年紀大，但句句真話！",
                    targetText_en: "I swear to Heaven that I definitely did not wrongly accuse him! He was obviously taking advantage of me intentionally. Although I am old, every word is the truth!"
                }
            ]
        },

        // ====================================================================
        // Case 5: 裁判法院 Level 3 (進階高壓) · 青年管有太空油毒品案
        // ====================================================================
        {
            id: "preset_mag_drugs_l3",
            title_zh: "裁判法院 ➜ [Level 3 進階高壓] 管有危險藥物 (太空油) 及吸毒器具案 (STCC 215/2026)",
            title_en: "Magistrates' Courts ➜ [Level 3 Advanced Adversarial] Possession of Dangerous Drugs (STCC 215/2026)",
            category: "criminal",
            venue: "magistrates",
            difficulty: 3,
            persona: "street_combative",
            voice_config: {
                counsel_gender: "female",
                witness_gender: "male",
                witness_age_group: "young"
            },
            desc_zh: "專為考核傳譯主任應對高壓盤問而設。涉及時下新興毒品「太空油」（依托咪酯 Etomidate）。主控官語速極快，運用多重否定、時間線緊逼連擊及假定性盤問窮追猛打；年輕被告閃爍其詞，藉口「幫朋友保管」。極度考驗法律合規性、化學品名詞及抗壓心態。",
            desc_en: "Advanced high-stakes drug possession trial involving Etomidate ('Space Oil'). Features rapid-fire compound prosecutorial questioning, challenging the youth defendant's custody explanation.",
            cls_guidelines: "1. 毒品專用語：'dangerous drug' -> 「危險藥物」；'Etomidate' -> 「依托咪酯」；俗稱「太空油」-> Space Oil / Etomidate pods\n2. 器具術語：'apparatus fit and intended for the smoking/inhalation of a dangerous drug' -> 「適合及擬用作吸食／吸入危險藥物嘅器具」\n3. 主控官多重否定與連擊格式：'Is it not the case that...' / 'I put it to you that...'\n4. 數量準確度：5粒煙彈、淨重12.5克、現金4,500元。",
            dialogue: [
                {
                    turn: 1, role_zh: "主控官", role_en: "Prosecutor", gender: "female", lang: "en-US",
                    text_zh: "Mr. Ho, at the material time on 18th January 2026, police officers intercepted you at the rear staircase of Mei Lam Estate in Sha Tin, correct?",
                    text_en: "Mr. Ho, at the material time on 18th January 2026, police officers intercepted you at the rear staircase of Mei Lam Estate in Sha Tin, correct?",
                    targetText_zh: "何先生，喺案發嗰陣，即係2026年1月18號，警員喺沙田美林邨嘅後樓梯截停你，係咪？",
                    targetText_en: "Mr. Ho, at the material time on 18th January 2026, police officers intercepted you at the rear staircase of Mei Lam Estate in Sha Tin, correct?"
                },
                {
                    turn: 2, role_zh: "被告 (何先生)", role_en: "Defendant (Mr. Ho)", gender: "male", age_group: "young", lang: "zh-HK",
                    text_zh: "係，大約夜晚十一點幾，我當時只係喺樓梯食緊普通電子煙打機。",
                    text_en: "Yes, around past 11:00 p.m., I was merely smoking an ordinary electronic cigarette and playing mobile games at the staircase.",
                    targetText_zh: "係，大約夜晚十一點幾，我當時只係喺樓梯食緊普通電子煙打機。",
                    targetText_en: "Yes, around past 11:00 p.m., I was merely smoking an ordinary electronic cigarette and playing mobile games at the staircase."
                },
                {
                    turn: 3, role_zh: "主控官", role_en: "Prosecutor", gender: "female", lang: "en-US",
                    text_zh: "Upon searching your black crossbody bag, officers found five unlabelled e-cigarette pods containing liquid, did they not?",
                    text_en: "Upon searching your black crossbody bag, officers found five unlabelled e-cigarette pods containing liquid, did they not?",
                    targetText_zh: "喺搜查你嘅黑色斜孭袋嗰陣，警員搜出五粒無標籤、裝有液體嘅電子煙彈，係咪？",
                    targetText_en: "Upon searching your black crossbody bag, officers found five unlabelled e-cigarette pods containing liquid, did they not?"
                },
                {
                    turn: 4, role_zh: "被告 (何先生)", role_en: "Defendant (Mr. Ho)", gender: "male", age_group: "young", lang: "zh-HK",
                    text_zh: "係搜到，但啲煙彈根本唔係我嘅，係一個叫阿峰嘅朋友十分鐘前擺低叫我幫佢睇住一陣㗎咋！",
                    text_en: "Yes they found them, but those pods were not mine at all! A friend called Ah Fung left them with me ten minutes earlier and asked me to look after them for a while!",
                    targetText_zh: "係搜到，但啲煙彈根本唔係我嘅，係一個叫阿峰嘅朋友十分鐘前擺低叫我幫佢睇住一陣㗎咋！",
                    targetText_en: "Yes they found them, but those pods were not mine at all! A friend called Ah Fung left them with me ten minutes earlier and asked me to look after them for a while!"
                },
                {
                    turn: 5, role_zh: "主控官", role_en: "Prosecutor", gender: "female", lang: "en-US",
                    text_zh: "According to the Government Chemist report, Exhibit P3, those five pods contained a total of 12.5 grams of liquid containing Etomidate, commonly known as Space Oil.",
                    text_en: "According to the Government Chemist report, Exhibit P3, those five pods contained a total of 12.5 grams of liquid containing Etomidate, commonly known as Space Oil.",
                    targetText_zh: "根據政府化驗所報告（證物P3），嗰五粒煙彈總共含有12.5克裝有「依托咪酯」、即係俗稱「太空油」嘅液體。",
                    targetText_en: "According to the Government Chemist report, Exhibit P3, those five pods contained a total of 12.5 grams of liquid containing Etomidate, commonly known as Space Oil."
                },
                {
                    turn: 6, role_zh: "被告 (何先生)", role_en: "Defendant (Mr. Ho)", gender: "male", age_group: "young", lang: "zh-HK",
                    text_zh: "我真係唔知入面係太空油！阿峰淨係同我講話係普通水果味果汁煙油，我先幫佢擺喺袋入面咋嘛！",
                    text_en: "I really didn't know it was Space Oil inside! Ah Fung only told me it was ordinary fruit-flavored e-juice, that was why I helped him keep it in my bag!",
                    targetText_zh: "我真係唔知入面係太空油！阿峰淨係同我講話係普通水果味果汁煙油，我先幫佢擺喺袋入面咋嘛！",
                    targetText_en: "I really didn't know it was Space Oil inside! Ah Fung only told me it was ordinary fruit-flavored e-juice, that was why I helped him keep it in my bag!"
                },
                {
                    turn: 7, role_zh: "主控官", role_en: "Prosecutor", gender: "female", lang: "en-US",
                    text_zh: "I suggest to you that you knew perfectly well that Etomidate is a controlled Part 1 poison and dangerous drug in Hong Kong.",
                    text_en: "I suggest to you that you knew perfectly well that Etomidate is a controlled Part 1 poison and dangerous drug in Hong Kong.",
                    targetText_zh: "我向你指出，你完全清楚知道「依托咪酯」喺香港係受管制嘅第一部毒藥及危險藥物。",
                    targetText_en: "I suggest to you that you knew perfectly well that Etomidate is a controlled Part 1 poison and dangerous drug in Hong Kong."
                },
                {
                    turn: 8, role_zh: "被告 (何先生)", role_en: "Defendant (Mr. Ho)", gender: "male", age_group: "young", lang: "zh-HK",
                    text_zh: "我聽過太空油違法，但我點知阿峰畀我嗰啲係毒品啫？我連個煙彈都未拆開過嚟睇！",
                    text_en: "I've heard that Space Oil is illegal, but how would I know what Ah Fung gave me were drugs? I hadn't even unpacked the pods to look!",
                    targetText_zh: "我聽過太空油違法，但我點知阿峰畀我嗰啲係毒品啫？我連個煙彈都未拆開過嚟睇！",
                    targetText_en: "I've heard that Space Oil is illegal, but how would I know what Ah Fung gave me were drugs? I hadn't even unpacked the pods to look!"
                },
                {
                    turn: 9, role_zh: "主控官", role_en: "Prosecutor", gender: "female", lang: "en-US",
                    text_zh: "Let me direct your attention to your seized mobile phone. There are Telegram messages showing you inquiring about purchasing 'Space Oil cartridges' for 800 dollars each.",
                    text_en: "Let me direct your attention to your seized mobile phone. There are Telegram messages showing you inquiring about purchasing 'Space Oil cartridges' for 800 dollars each.",
                    targetText_zh: "等我帶你睇吓你被檢取嘅手機。入面嘅Telegram訊息顯示，你曾經向人查詢以每粒800蚊購買「太空油煙彈」。",
                    targetText_en: "Let me direct your attention to your seized mobile phone. There are Telegram messages showing you inquiring about purchasing 'Space Oil cartridges' for 800 dollars each."
                },
                {
                    turn: 10, role_zh: "被告 (何先生)", role_en: "Defendant (Mr. Ho)", gender: "male", age_group: "young", lang: "zh-HK",
                    text_zh: "嗰個電話紀錄係幾個月前好奇問下咋嘛，問下唔代表我今次身上嗰啲係我自己買㗎！",
                    text_en: "That phone record was just asking out of curiosity months ago. Asking doesn't mean that the ones on me this time were bought by myself!",
                    targetText_zh: "嗰個電話紀錄係幾個月前好奇問下咋嘛，問下唔代表我今次身上嗰啲係我自己買㗎！",
                    targetText_en: "That phone record was just asking out of curiosity months ago. Asking doesn't mean that the ones on me this time were bought by myself!"
                },
                {
                    turn: 11, role_zh: "主控官", role_en: "Prosecutor", gender: "female", lang: "en-US",
                    text_zh: "Officers also seized a specialized electronic vaping device and 4,500 dollars in cash inside your pocket, is that correct?",
                    text_en: "Officers also seized a specialized electronic vaping device and 4,500 dollars in cash inside your pocket, is that correct?",
                    targetText_zh: "警員仲喺你嘅褲袋入面檢取咗一部特製嘅電子煙吸食器具，同埋四千五百蚊現金，係咪？",
                    targetText_en: "Officers also seized a specialized electronic vaping device and 4,500 dollars in cash inside your pocket, is that correct?"
                },
                {
                    turn: 12, role_zh: "被告 (何先生)", role_en: "Defendant (Mr. Ho)", gender: "male", age_group: "young", lang: "zh-HK",
                    text_zh: "嗰四千幾蚊係我啱啱出糧攞嚟畀家用嘅現金，支電子煙機周街都有得賣啦，唔通有煙機就等於吸毒咩？",
                    text_en: "Those four thousand-odd dollars were cash from my salary just withdrawn for household expenses. That vape device is sold everywhere on the streets, does having a vape mean I'm doing drugs?",
                    targetText_zh: "嗰四千幾蚊係我啱啱出糧攞嚟畀家用嘅現金，支電子煙機周街都有得賣啦，唔通有煙機就等於吸毒咩？",
                    targetText_en: "Those four thousand-odd dollars were cash from my salary just withdrawn for household expenses. That vape device is sold everywhere on the streets, does having a vape mean I'm doing drugs?"
                },
                {
                    turn: 13, role_zh: "主控官", role_en: "Prosecutor", gender: "female", lang: "en-US",
                    text_zh: "Is it not the case that you did not provide any full name, phone number, or contact details for this alleged 'Ah Fung' during your cautioned interview?",
                    text_en: "Is it not the case that you did not provide any full name, phone number, or contact details for this alleged 'Ah Fung' during your cautioned interview?",
                    targetText_zh: "喺警誡會面入面，你根本提供唔出呢位所謂「阿峰」嘅全名、電話或者任何聯絡資料，係咪噉？",
                    targetText_en: "Is it not the case that you did not provide any full name, phone number, or contact details for this alleged 'Ah Fung' during your cautioned interview?"
                },
                {
                    turn: 14, role_zh: "被告 (何先生)", role_en: "Defendant (Mr. Ho)", gender: "male", age_group: "young", lang: "zh-HK",
                    text_zh: "我淨係喺酒吧同打機識佢，大家不嬲用Telegram叫花名，我都想搵佢出嚟對質還我清白呀！",
                    text_en: "I only knew him from bars and gaming. We always used nicknames on Telegram. I also want to find him to confront him and clear my name!",
                    targetText_zh: "我淨係喺酒吧同打機識佢，大家不嬲用Telegram叫花名，我都想搵佢出嚟對質還我清白呀！",
                    targetText_en: "I only knew him from bars and gaming. We always used nicknames on Telegram. I also want to find him to confront him and clear my name!"
                },
                {
                    turn: 15, role_zh: "主控官", role_en: "Prosecutor", gender: "female", lang: "en-US",
                    text_zh: "I challenge your assertion. I suggest that 'Ah Fung' is a complete fiction invented to evade criminal liability for drug trafficking and possession.",
                    text_en: "I challenge your assertion. I suggest that 'Ah Fung' is a complete fiction invented to evade criminal liability for drug trafficking and possession.",
                    targetText_zh: "我對你嘅說法提出質疑。我向你指出，「阿峰」完全係你捏造出嚟嘅虛構人物，目的係為咗逃避販毒同管有危險藥物嘅刑事責任。",
                    targetText_en: "I challenge your assertion. I suggest that 'Ah Fung' is a complete fiction invented to evade criminal liability for drug trafficking and possession."
                },
                {
                    turn: 16, role_zh: "被告 (何先生)", role_en: "Defendant (Mr. Ho)", gender: "male", age_group: "young", lang: "zh-HK",
                    text_zh: "我冇捏造！美林邨商場周圍都有天眼CCTV，如果差人有去查，一定影到阿峰遞個袋畀我！",
                    text_en: "I did not fabricate it! There are CCTV cameras everywhere around Mei Lam Estate shopping mall. If the police checked, they would definitely capture Ah Fung handing the bag to me!",
                    targetText_zh: "我冇捏造！美林邨商場周圍都有天眼CCTV，如果差人有去查，一定影到阿峰遞個袋畀我！",
                    targetText_en: "I did not fabricate it! There are CCTV cameras everywhere around Mei Lam Estate shopping mall. If the police checked, they would definitely capture Ah Fung handing the bag to me!"
                },
                {
                    turn: 17, role_zh: "主控官", role_en: "Prosecutor", gender: "female", lang: "en-US",
                    text_zh: "CCTV footage confirmed you entered the rear staircase alone at 11:15 p.m., and no person matching your description of 'Ah Fung' ever approached you.",
                    text_en: "CCTV footage confirmed you entered the rear staircase alone at 11:15 p.m., and no person matching your description of 'Ah Fung' ever approached you.",
                    targetText_zh: "閉路電視片段證實，你喺夜晚十一點十五分一個人行入後樓梯，而且從來冇任何符合你描述嘅「阿峰」走近過你。",
                    targetText_en: "CCTV footage confirmed you entered the rear staircase alone at 11:15 p.m., and no person matching your description of 'Ah Fung' ever approached you."
                },
                {
                    turn: 18, role_zh: "被告 (何先生)", role_en: "Defendant (Mr. Ho)", gender: "male", age_group: "young", lang: "zh-HK",
                    text_zh: "可能係佢喺地下交畀我，唔係喺後樓梯……嗰陣黑麻麻，我真係記唔清楚具體交收位置！",
                    text_en: "Maybe it was on the ground floor where he handed it to me, not at the rear staircase... it was dark at that time, I really cannot recall the exact handover spot!",
                    targetText_zh: "可能係佢喺地下交畀我，唔係喺後樓梯……嗰陣黑麻麻，我真係記唔清楚具體交收位置！",
                    targetText_en: "Maybe it was on the ground floor where he handed it to me, not at the rear staircase... it was dark at that time, I really cannot recall the exact handover spot!"
                },
                {
                    turn: 19, role_zh: "主控官", role_en: "Prosecutor", gender: "female", lang: "en-US",
                    text_zh: "I put it to you that you had custody and control of those five Space Oil pods, and you knew they were dangerous drugs intended for your own consumption or supply.",
                    text_en: "I put it to you that you had custody and control of those five Space Oil pods, and you knew they were dangerous drugs intended for your own consumption or supply.",
                    targetText_zh: "我向你指出，你實際管有同控制嗰五粒太空油煙彈，而且你知道嗰啲係危險藥物，擬作你自己吸食或者供應畀他人。",
                    targetText_en: "I put it to you that you had custody and control of those five Space Oil pods, and you knew they were dangerous drugs intended for your own consumption or supply."
                },
                {
                    turn: 20, role_zh: "被告 (何先生)", role_en: "Defendant (Mr. Ho)", gender: "male", age_group: "young", lang: "zh-HK",
                    text_zh: "我絕對唔同意！我只係講義氣幫朋友保管雜物，我俾人陷於不義，根本唔知入面係太空油！",
                    text_en: "I absolutely disagree! I was merely being loyal to help a friend keep some belongings. I was framed and put in an unjust position; I had no idea it was Space Oil inside!",
                    targetText_zh: "我絕對唔同意！我只係講義氣幫朋友保管雜物，我俾人陷於不義，根本唔知入面係太空油！",
                    targetText_en: "I absolutely disagree! I was merely being loyal to help a friend keep some belongings. I was framed and put in an unjust position; I had no idea it was Space Oil inside!"
                }
            ]
        }
    ]
};