// ============================================================================
// app.js - Step 3 升級版：
// 1. 新增「分級進階 (Level 1-3)、場所 (裁判法院/審裁處) 及特種證人畫像」選擇器
// 2. 在生成面板及「📝 教材審訂工作坊」加入「🎙️ 角色性別與年齡聲線鎖定配置 (Voice Config)」
// 3. 合成語音與即時播放時嚴格鎖定同一把男女聲線與長者/高壓語速，杜絕聲線跳躍
// ============================================================================

(function () {
    const { useState, useEffect, useRef, createElement: h, Fragment } = React;
    const { T, ORIGINAL_PRESETS } = window.CLS_DATA;
    const CLS_SERVICES = window.CLS_SERVICES;

    // 1. SVG 圖示組件庫
    const Icons = {
        Mic: () => h("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" })
        ),
        Play: () => h("svg", { className: "w-5 h-5 text-blue-900", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" }),
            h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
        ),
        Spinner: () => h("svg", { className: "w-5 h-5 text-blue-900 animate-spin", fill: "none", viewBox: "0 0 24 24" },
            h("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
            h("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })
        ),
        Settings: () => h("svg", { className: "w-5 h-5 text-gray-800", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
            h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
        ),
        Folder: () => h("svg", { className: "w-5 h-5 text-gray-800", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" })
        ),
        Check: () => h("svg", { className: "w-4 h-4 text-blue-900", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" })
        ),
        ArrowRight: () => h("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M14 5l7 7m0 0l-7 7m7-7H3" })
        ),
        ArrowLeft: () => h("svg", { className: "w-4 h-4 text-gray-700", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 19l-7-7m0 0l7-7m-7 7h18" })
        ),
        Report: () => h("svg", { className: "w-5 h-5 text-gray-800", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })
        ),
        Contrast: () => h("svg", { className: "w-4 h-4 text-white", fill: "currentColor", viewBox: "0 0 24 24" },
            h("path", { d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2V4a8 8 0 100 16z" })
        )
    };

    const PERSONA_LABELS = {
        standard: "👤 常規證人",
        street_combative: "🔥 市井／情緒化證人",
        elderly_garrulous: "👵 長者／囉嗦迂迴證人",
        non_native: "🌏 少數族裔／非地道語法",
        technical_tribunal: "📐 審裁處／技術專家證人"
    };

    // 子組件：📝 教材審訂及工作坊全螢幕視窗 (CoursewareEditorModal)
    function CoursewareEditorModal({ editingCase, onClose, onSaveCase, onSaveAndBakeAudio, isBaking }) {
        if (!editingCase) return null;

        const [draft, setDraft] = useState(() => {
            const copy = JSON.parse(JSON.stringify(editingCase));
            if (!copy.voice_config) {
                copy.voice_config = {
                    counsel_gender: "male",
                    witness_gender: "female",
                    witness_age_group: copy.persona === "elderly_garrulous" ? "elderly" : "adult"
                };
            }
            return copy;
        });

        // 當培訓官在審訂視窗更改「律師性別」或「證人性別/年齡」時，自動清除舊語音並同步更新全卷 20 題的聲線設定
        const handleVoiceConfigChange = (key, val) => {
            setDraft(prev => {
                const updatedVc = { ...(prev.voice_config || {}), [key]: val };
                const updatedDialogue = prev.dialogue.map(turn => {
                    const isOdd = turn.turn % 2 === 1;
                    const updatedTurn = { ...turn };
                    if (isOdd && key === "counsel_gender") {
                        delete updatedTurn.audio_base64;
                        updatedTurn.gender = val;
                    } else if (!isOdd && (key === "witness_gender" || key === "witness_age_group")) {
                        delete updatedTurn.audio_base64;
                        if (key === "witness_gender") updatedTurn.gender = val;
                        if (key === "witness_age_group") updatedTurn.age_group = val;
                    }
                    return updatedTurn;
                });
                return { ...prev, voice_config: updatedVc, dialogue: updatedDialogue };
            });
        };

        const handleTurnChange = (idx, field, val) => {
            setDraft(prev => {
                const updatedDialogue = [...prev.dialogue];
                const turnItem = { ...updatedDialogue[idx] };
                const isEn = turnItem.lang === "en-US";

                if (field === "sourceText") {
                    delete turnItem.audio_base64;
                    if (isEn) {
                        turnItem.text_en = val;
                        turnItem.text_zh = val;
                        turnItem.targetText_en = val;
                    } else {
                        turnItem.text_zh = val;
                        turnItem.text_en = val;
                        turnItem.targetText_zh = val;
                    }
                } else if (field === "targetText") {
                    if (isEn) {
                        turnItem.targetText_zh = val;
                    } else {
                        turnItem.targetText_en = val;
                    }
                } else if (field === "role_zh") {
                    turnItem.role_zh = val;
                } else if (field === "role_en") {
                    turnItem.role_en = val;
                }

                updatedDialogue[idx] = turnItem;
                return { ...prev, dialogue: updatedDialogue };
            });
        };

        return h("div", { className: "fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" },
            h("div", { className: "bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden" },
                h("div", { className: "bg-blue-900 text-white px-6 py-4 flex justify-between items-center" },
                    h("div", null,
                        h("h2", { className: "text-base font-extrabold flex items-center space-x-2" },
                            h("span", null, "📝 教材審訂、聲線鎖定及工作坊 (Courseware & Voice QA Studio)")
                        ),
                        h("p", { className: "text-xs text-blue-200 mt-0.5" },
                            "您可在此鎖定律師與證人的性別／年齡聲線、設定案件難度與特種證人模式，並微調 20 輪問答與參考譯文。"
                        )
                    ),
                    h("button", {
                        onClick: onClose,
                        className: "text-white hover:text-amber-400 font-bold text-lg px-2 cursor-pointer"
                    }, "✕")
                ),

                h("div", { className: "p-6 overflow-y-auto space-y-5 flex-1 bg-gray-50" },
                    h("div", { className: "bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4" },
                        h("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3" },
                            h("div", null,
                                h("label", { className: "block text-xs font-bold text-gray-600 mb-1" }, "案件標題 (中文)"),
                                h("input", {
                                    type: "text",
                                    value: draft.title_zh || "",
                                    onChange: e => setDraft(prev => ({ ...prev, title_zh: e.target.value })),
                                    className: "w-full text-xs font-bold p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900"
                                })
                            ),
                            h("div", null,
                                h("label", { className: "block text-xs font-bold text-gray-600 mb-1" }, "Case Title (English)"),
                                h("input", {
                                    type: "text",
                                    value: draft.title_en || "",
                                    onChange: e => setDraft(prev => ({ ...prev, title_en: e.target.value })),
                                    className: "w-full text-xs font-bold p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900"
                                })
                            )
                        ),

                        // 新增：分級難度、特種證人與固定聲線配對設定列
                        h("div", { className: "bg-purple-50 border border-purple-200 rounded-xl p-3.5 grid grid-cols-2 md:grid-cols-5 gap-3" },
                            h("div", null,
                                h("label", { className: "block text-[11px] font-extrabold text-purple-900 mb-1" }, "📊 難易度分級"),
                                h("select", {
                                    value: draft.difficulty || 2,
                                    onChange: e => setDraft(prev => ({ ...prev, difficulty: Number(e.target.value) })),
                                    className: "w-full text-xs font-bold p-1.5 border border-purple-300 rounded bg-white text-gray-900"
                                },
                                    h("option", { value: 1 }, "Level 1 (入門奠基)"),
                                    h("option", { value: 2 }, "Level 2 (常規實戰)"),
                                    h("option", { value: 3 }, "Level 3 (進階高壓)")
                                )
                            ),
                            h("div", null,
                                h("label", { className: "block text-[11px] font-extrabold text-purple-900 mb-1" }, "🎭 特種證人畫像"),
                                h("select", {
                                    value: draft.persona || "standard",
                                    onChange: e => setDraft(prev => ({ ...prev, persona: e.target.value })),
                                    className: "w-full text-xs font-bold p-1.5 border border-purple-300 rounded bg-white text-gray-900"
                                },
                                    h("option", { value: "standard" }, "👤 常規證人"),
                                    h("option", { value: "street_combative" }, "🔥 市井／情緒化"),
                                    h("option", { value: "elderly_garrulous" }, "👵 長者／囉嗦迂迴"),
                                    h("option", { value: "non_native" }, "🌏 少數族裔口音"),
                                    h("option", { value: "technical_tribunal" }, "📐 審裁處／專家")
                                )
                            ),
                            h("div", null,
                                h("label", { className: "block text-[11px] font-extrabold text-purple-900 mb-1" }, "🎙️ 發問方(律師)固定聲線"),
                                h("select", {
                                    value: draft.voice_config?.counsel_gender || "male",
                                    onChange: e => handleVoiceConfigChange("counsel_gender", e.target.value),
                                    className: "w-full text-xs font-bold p-1.5 border border-purple-300 rounded bg-white text-gray-900"
                                },
                                    h("option", { value: "male" }, "👨‍⚖️ 沉穩男聲 (Onyx / Ryan)"),
                                    h("option", { value: "female" }, "👩‍⚖️ 幹練女聲 (Alloy / Sonia)")
                                )
                            ),
                            h("div", null,
                                h("label", { className: "block text-[11px] font-extrabold text-purple-900 mb-1" }, "🎙️ 證人/事主固定性別"),
                                h("select", {
                                    value: draft.voice_config?.witness_gender || "female",
                                    onChange: e => handleVoiceConfigChange("witness_gender", e.target.value),
                                    className: "w-full text-xs font-bold p-1.5 border border-purple-300 rounded bg-white text-gray-900"
                                },
                                    h("option", { value: "female" }, "👩 女性聲線 (Nova / HiuMaan)"),
                                    h("option", { value: "male" }, "👨 男性聲線 (Echo / WanLung)")
                                )
                            ),
                            h("div", null,
                                h("label", { className: "block text-[11px] font-extrabold text-purple-900 mb-1" }, "🎂 證人年齡與語速特徵"),
                                h("select", {
                                    value: draft.voice_config?.witness_age_group || "adult",
                                    onChange: e => handleVoiceConfigChange("witness_age_group", e.target.value),
                                    className: "w-full text-xs font-bold p-1.5 border border-purple-300 rounded bg-white text-gray-900"
                                },
                                    h("option", { value: "young" }, "青年 (語速明快)"),
                                    h("option", { value: "adult" }, "成年 (標準語速)"),
                                    h("option", { value: "elderly" }, "長者 (語速稍慢 0.88x)")
                                )
                            )
                        ),

                        h("div", null,
                            h("label", { className: "block text-xs font-bold text-gray-600 mb-1" }, "案情簡介 (中文)"),
                            h("textarea", {
                                rows: "2",
                                value: draft.desc_zh || "",
                                onChange: e => setDraft(prev => ({ ...prev, desc_zh: e.target.value })),
                                className: "w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900"
                            })
                        ),
                        h("div", null,
                            h("label", { className: "block text-xs font-extrabold text-indigo-900 mb-1" },
                                "📌 本案專屬 CLS 強制術語及評分要點 (Case-Specific Glossary & Marking Scheme)"
                            ),
                            h("textarea", {
                                rows: "3",
                                placeholder: "例如：\n- stooge account 必須譯為「傀儡戶口」\n- 第 8 題「陷我於不義」若能譯出 frame me up / put me in an unjust position 可獲高分",
                                value: draft.cls_guidelines || "",
                                onChange: e => setDraft(prev => ({ ...prev, cls_guidelines: e.target.value })),
                                className: "w-full text-xs p-2 border border-indigo-300 rounded bg-indigo-50/40 text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-700"
                            })
                        )
                    ),

                    h("div", { className: "space-y-3" },
                        h("h3", { className: "text-xs font-extrabold text-blue-900 uppercase" },
                            "📋 逐輪問答對白及司法標準參考譯文審訂 (共 " + draft.dialogue.length + " 輪)"
                        ),
                        draft.dialogue.map((turn, idx) => {
                            const isEn = turn.lang === "en-US";
                            const sourceVal = isEn ? turn.text_en : turn.text_zh;
                            const targetVal = isEn ? turn.targetText_zh : turn.targetText_en;

                            return h("div", {
                                key: idx,
                                className: "bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2"
                            },
                                h("div", { className: "flex justify-between items-center border-b border-gray-100 pb-2" },
                                    h("div", { className: "flex items-center space-x-2" },
                                        h("span", { className: "bg-blue-900 text-white text-[11px] font-extrabold px-2 py-0.5 rounded" },
                                            "Turn " + turn.turn
                                        ),
                                        h("span", { className: "text-xs font-bold text-gray-700" },
                                            isEn ? "🇬🇧 英語盤問 ➔ 粵語傳譯" : "🇭🇰 粵語供詞 ➔ 英語傳譯"
                                        ),
                                        turn.audio_base64 && h("span", { className: "bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded" },
                                            "🎙️ 已有內嵌語音"
                                        )
                                    ),
                                    h("div", { className: "flex items-center space-x-2" },
                                        h("input", {
                                            type: "text",
                                            value: turn.role_zh || "",
                                            onChange: e => handleTurnChange(idx, "role_zh", e.target.value),
                                            placeholder: "中文角色",
                                            className: "text-xs font-bold border border-gray-200 rounded px-2 py-1 w-28"
                                        }),
                                        h("input", {
                                            type: "text",
                                            value: turn.role_en || "",
                                            onChange: e => handleTurnChange(idx, "role_en", e.target.value),
                                            placeholder: "English Role",
                                            className: "text-xs border border-gray-200 rounded px-2 py-1 w-36"
                                        })
                                    )
                                ),

                                h("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-1" },
                                    h("div", null,
                                        h("label", { className: "block text-[11px] font-bold text-gray-600 mb-1" },
                                            "🔊 法庭原聲句子 (" + (isEn ? "English Source" : "廣東話原句") + ")"
                                        ),
                                        h("textarea", {
                                            rows: "3",
                                            value: sourceVal || "",
                                            onChange: e => handleTurnChange(idx, "sourceText", e.target.value),
                                            className: "w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900 leading-relaxed"
                                        })
                                    ),
                                    h("div", null,
                                        h("label", { className: "block text-[11px] font-bold text-emerald-700 mb-1" },
                                            "🌟 CLS 司法標準參考譯法 (" + (isEn ? "廣東話參考譯文" : "English Target Translation") + ")"
                                        ),
                                        h("textarea", {
                                            rows: "3",
                                            value: targetVal || "",
                                            onChange: e => handleTurnChange(idx, "targetText", e.target.value),
                                            className: "w-full text-xs p-2 border border-emerald-300 bg-emerald-50/30 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700 leading-relaxed"
                                        })
                                    )
                                )
                            );
                        })
                    )
                ),

                h("div", { className: "bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center flex-wrap gap-3" },
                    h("button", {
                        onClick: onClose,
                        className: "border border-gray-400 text-gray-700 font-bold py-2 px-5 rounded-lg text-xs hover:bg-gray-100 cursor-pointer"
                    }, "取消"),

                    h("div", { className: "flex items-center space-x-3" },
                        h("button", {
                            onClick: () => onSaveCase(draft),
                            disabled: isBaking,
                            className: "bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-5 rounded-lg text-xs shadow cursor-pointer disabled:opacity-50"
                        }, "💾 僅儲存修改並採用"),

                        h("button", {
                            onClick: () => onSaveAndBakeAudio(draft),
                            disabled: isBaking,
                            className: "bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-2 px-5 rounded-lg text-xs shadow cursor-pointer disabled:opacity-50"
                        }, isBaking ? "⏳ 正在按固定聲線合成語音中..." : "🎙️ 儲存修改並按固定角色聲線合成全卷語音 (匯出 JSON)")
                    )
                )
            )
        );
    }

    // 子組件 1：頂部導航欄 (HeaderBar)
    function HeaderBar({ lang, setLang, isInverted, setIsInverted, TString }) {
        return h("header", { className: "bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md" },
            h("div", { className: "flex items-center space-x-3" },
                h("span", { className: "bg-amber-500 text-blue-900 font-extrabold px-3 py-1.5 rounded text-sm tracking-wider" }, "CLS"),
                h("div", null,
                    h("h1", { className: "text-xl font-extrabold tracking-wide text-white" }, TString.appTitle),
                    h("p", { className: "text-xs text-blue-200" }, TString.appSub)
                )
            ),
            h("div", { className: "flex items-center space-x-4" },
                h("div", { className: "flex bg-blue-800 rounded" },
                    h("button", {
                        onClick: () => setLang("zh"),
                        className: "px-2 py-1 text-xs font-bold rounded " + (lang === "zh" ? "bg-amber-500 text-blue-900" : "text-white")
                    }, "繁中"),
                    h("button", {
                        onClick: () => setLang("en"),
                        className: "px-2 py-1 text-xs font-bold rounded " + (lang === "en" ? "bg-amber-500 text-blue-900" : "text-white")
                    }, "EN")
                ),
                h("button", {
                    onClick: () => setIsInverted(!isInverted),
                    className: "bg-gray-800 hover:bg-gray-700 text-white font-bold py-1.5 px-3 rounded text-xs flex items-center space-x-1.5 transition-all shadow"
                },
                    h(Icons.Contrast),
                    h("span", null, TString.contrastMode)
                )
            )
        );
    }

    // 子組件 2：左側訓練設定面板 (TrainerConfigPanel)
    function TrainerConfigPanel({
        TString, traineeName, setTraineeName, traineeId, setTraineeId,
        isBlindMode, setIsBlindMode,
        isDeferredEvalMode, setIsDeferredEvalMode,
        customRubric, setCustomRubric,
        practiceTurnsLimit, setPracticeTurnsLimit,
        speechRate, setSpeechRate, ttsModel, setTtsModel,
        openRouterApiKey, setOpenRouterApiKey, onTurnReset
    }) {
        const [showRubricEditor, setShowRubricEditor] = useState(false);

        return h("div", { className: "bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4" },
            h("h2", { className: "text-sm font-bold text-gray-800 flex items-center space-x-2 border-b pb-2" },
                h(Icons.Settings),
                h("span", null, TString.trainerConfig)
            ),

            h("div", { className: "grid grid-cols-2 gap-3" },
                h("div", null,
                    h("label", { className: "block text-xs font-bold text-gray-500 mb-1" }, TString.traineeName),
                    h("input", {
                        type: "text",
                        placeholder: "例如：Chan Tai Man",
                        value: traineeName,
                        onChange: e => setTraineeName(e.target.value),
                        className: "w-full bg-gray-50 border border-gray-200 rounded p-2 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    })
                ),
                h("div", null,
                    h("label", { className: "block text-xs font-bold text-gray-500 mb-1" }, TString.traineeId),
                    h("input", {
                        type: "text",
                        placeholder: "例如：CI-2026-08",
                        value: traineeId,
                        onChange: e => setTraineeId(e.target.value),
                        className: "w-full bg-gray-50 border border-gray-200 rounded p-2 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    })
                )
            ),

            h("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-center" },
                h("div", null,
                    h("div", { className: "text-xs font-extrabold text-amber-900" }, TString.blindModeTitle),
                    h("div", { className: "text-[11px] text-amber-700 mt-0.5" }, isBlindMode ? TString.blindModeOn : TString.blindModeOff)
                ),
                h("button", {
                    onClick: () => setIsBlindMode(!isBlindMode),
                    className: "px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all shadow-sm cursor-pointer " + (isBlindMode ? "bg-amber-500 text-blue-900 hover:bg-amber-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300")
                }, isBlindMode ? "🎧 盲聽開啟" : "📖 顯示原文")
            ),

            h("div", { className: "bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex justify-between items-center" },
                h("div", { className: "pr-2" },
                    h("div", { className: "text-xs font-extrabold text-indigo-900" }, "⚡ 評核流程模式 (Debriefing Flow)"),
                    h("div", { className: "text-[11px] text-indigo-700 mt-0.5" },
                        isDeferredEvalMode
                            ? "連貫實戰：按下一題時背景靜默AI預審，完卷後一併顯示結果"
                            : "逐題即時點評：每答完一題即場顯示 AI 點評卡片"
                    )
                ),
                h("button", {
                    onClick: () => setIsDeferredEvalMode(!isDeferredEvalMode),
                    className: "px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all shadow-sm cursor-pointer " + (isDeferredEvalMode ? "bg-indigo-700 text-white hover:bg-indigo-800" : "bg-gray-200 text-gray-700 hover:bg-gray-300")
                }, isDeferredEvalMode ? "🏁 完卷總評" : "⚡ 逐題點評")
            ),

            h("div", { className: "border border-gray-200 rounded-lg p-3 bg-gray-50" },
                h("div", { className: "flex justify-between items-center" },
                    h("span", { className: "text-xs font-extrabold text-blue-900" }, "📏 CLS 評分準則及法庭特定譯法"),
                    h("button", {
                        onClick: () => setShowRubricEditor(!showRubricEditor),
                        className: "text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                    }, showRubricEditor ? "🔼 收起準則" : "✏️ 檢視/自訂準則")
                ),
                showRubricEditor && h("div", { className: "mt-2 space-y-2 animate-fade-in" },
                    h("p", { className: "text-[11px] text-gray-600 leading-relaxed" },
                        "以下準則與特定詞彙會直接注入 AI 評審大腦。您可隨時加入香港法庭特定譯法，AI 批改時會嚴格執行："
                    ),
                    h("textarea", {
                        rows: "6",
                        value: customRubric,
                        onChange: e => setCustomRubric(e.target.value),
                        className: "w-full text-[11px] border border-gray-300 rounded p-2 bg-white text-gray-900 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-900"
                    }),
                    h("div", { className: "flex justify-end" },
                        h("button", {
                            onClick: () => setCustomRubric(CLS_SERVICES.DEFAULT_CLS_RUBRIC),
                            className: "text-[11px] text-gray-500 hover:text-red-600 underline cursor-pointer"
                        }, "↺ 還原為 CLS 預設準則")
                    )
                )
            ),

            h("div", { className: "grid grid-cols-2 gap-3" },
                h("div", null,
                    h("label", { className: "block text-xs font-bold text-gray-500 mb-1" }, TString.practiceTurns),
                    h("select", {
                        value: practiceTurnsLimit,
                        onChange: e => {
                            onTurnReset();
                            setPracticeTurnsLimit(Number(e.target.value));
                        },
                        className: "w-full bg-gray-50 border border-gray-200 rounded p-2 text-xs font-bold text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    },
                        h("option", { value: 5 }, "5 輪 (快速測試)"),
                        h("option", { value: 10 }, "10 輪 (標準長度)"),
                        h("option", { value: 15 }, "15 輪 (進階長度)"),
                        h("option", { value: 20 }, "20 輪 (完整情節)")
                    )
                ),
                h("div", null,
                    h("label", { className: "block text-xs font-bold text-gray-500 mb-1" }, TString.speechSpeed),
                    h("select", {
                        value: speechRate,
                        onChange: e => setSpeechRate(parseFloat(e.target.value)),
                        className: "w-full bg-gray-50 border border-gray-200 rounded p-2 text-xs font-bold text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    },
                        h("option", { value: 0.8 }, "0.8x"),
                        h("option", { value: 1.0 }, "1.0x"),
                        h("option", { value: 1.1 }, "1.1x"),
                        h("option", { value: 1.2 }, "1.2x")
                    )
                )
            ),

            h("div", { className: "pt-2 border-t border-gray-100" },
                h("label", { className: "block text-xs font-bold text-gray-500 mb-1" }, TString.ttsModelLabel),
                h("select", {
                    value: ttsModel,
                    onChange: e => setTtsModel(e.target.value),
                    className: "w-full bg-gray-50 border border-gray-200 rounded p-2 text-xs font-bold text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                },
                    h("option", { value: "fish-audio/s2.1-pro" }, "🌟 Fish Audio S2.1 Pro (超自然香港粵語 + 英語)"),
                    h("option", { value: "fish-audio/s2.1-pro-free" }, "🆓 Fish Audio S2.1 Pro Free (免費測試粵語 + 英語)"),
                    h("option", { value: "fish-audio/drama-3" }, "🎭 Fish Audio Drama 3 (支援法庭情緒語氣指導)"),
                    h("option", { value: "elevenlabs/eleven-v4-turbo" }, "🎙️ ElevenLabs v4 Turbo (多語種真人擬真發音)"),
                    h("option", { value: "openai/gpt-4o-mini-tts-2025-12-15" }, "🤖 OpenAI GPT-4o Mini TTS (支援語氣指令)"),
                    h("option", { value: "browser" }, "💻 瀏覽器內置機械發音 (離線免 API)")
                )
            ),

            h("div", { className: "pt-2 border-t border-gray-100" },
                h("div", { className: "flex justify-between items-center mb-1" },
                    h("label", { className: "text-xs font-bold text-gray-500" }, TString.apiKey),
                    h("span", {
                        className: "text-[10px] font-bold px-1.5 py-0.5 rounded " + (openRouterApiKey.trim() ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800")
                    }, openRouterApiKey.trim() ? "⚡ GLM + 真人語音已啟用" : "⚙️ 離線模式")
                ),
                h("input", {
                    type: "password",
                    placeholder: "sk-or-v1-... (同一金鑰通用於 GLM 及真人發音)",
                    value: openRouterApiKey,
                    onChange: e => setOpenRouterApiKey(e.target.value),
                    className: "w-full text-xs p-2 border border-gray-200 rounded bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                })
            )
        );
    }

    // 子組件 3：左側教材庫清單面板 (PresetLibraryPanel)
    function PresetLibraryPanel({
        TString, lang, presets, currentCase, isAdmin, handleUnlockAdmin,
        bakingCaseId, bakingProgress, handlePrebakeCaseAudio,
        handleExportPreset, handleDeletePreset, onSelectCase,
        onOpenEditor, onExportFullPresetsJs
    }) {
        return h("div", { className: "bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex-1" },
            h("div", { className: "flex justify-between items-center border-b border-gray-200 pb-2 mb-3" },
                h("h2", { className: "text-sm font-bold text-blue-900 flex items-center space-x-2" },
                    h(Icons.Folder),
                    h("span", { className: "text-blue-900 uppercase" }, TString.presetLibrary)
                ),
                h("button", {
                    onClick: handleUnlockAdmin,
                    className: "text-xs font-bold px-2.5 py-1.5 rounded transition-all shadow-sm cursor-pointer " + (isAdmin ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200")
                }, isAdmin ? TString.adminMode : TString.unlockAdmin)
            ),

            isAdmin && h("div", { className: "bg-purple-50 border border-purple-200 text-purple-900 rounded-lg p-3 mb-3 space-y-2 text-[11px] leading-relaxed" },
                h("div", null, "💡 管理員工作台已啟用："),
                h("ul", { className: "list-disc pl-4 space-y-0.5" },
                    h("li", null, "點擊案件右側 ✏️ 可設定角色性別聲線、難度、特種證人及審訂對白。"),
                    h("li", null, "點擊 🎙️ 可按鎖定角色聲線合成全卷 20 輪真人粵英發音。"),
                    h("li", null, "點擊下方按鈕可將目前所有案件直接匯出為最新 presets.js 永久保存！")
                ),
                h("button", {
                    onClick: onExportFullPresetsJs,
                    className: "w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-2 px-3 rounded-lg text-xs shadow cursor-pointer mt-1"
                }, "💾 導出最新 presets.js 原始碼檔案 (永久保存全部教材)")
            ),

            h("div", { className: "space-y-3 overflow-y-auto max-h-96 pr-1" },
                presets.map((item, idx) => {
                    const isThisCaseBaking = bakingCaseId === item.id;
                    const hasPrebaked = item.has_prebaked_audio || (item.dialogue && item.dialogue.some(d => Boolean(d.audio_base64)));

                    return h("div", {
                        key: idx,
                        onClick: () => onSelectCase(item),
                        className: "p-3 rounded-lg border text-left cursor-pointer transition-all relative group " + (currentCase.id === item.id ? "bg-blue-50 border-blue-400" : "bg-white hover:border-gray-400")
                    },
                        h("div", {
                            className: "absolute top-2 right-2 flex space-x-1 transition-opacity " + (isThisCaseBaking ? "opacity-100" : "opacity-0 group-hover:opacity-100")
                        },
                            isAdmin && h("button", {
                                onClick: e => { e.stopPropagation(); onOpenEditor(item); },
                                className: "text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded text-xs font-bold shadow-sm",
                                title: "審訂/編輯此案件的對白、聲線配置與專屬詞彙"
                            }, "✏️"),
                            isAdmin && h("button", {
                                onClick: e => handlePrebakeCaseAudio(e, item),
                                disabled: Boolean(bakingCaseId),
                                className: "text-purple-700 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded text-xs font-bold shadow-sm disabled:opacity-50",
                                title: "預先合成全卷 20 輪真人語音並打包匯出為離線 JSON 教材"
                            }, isThisCaseBaking ? ("⏳ " + bakingProgress) : "🎙️"),
                            h("button", {
                                onClick: e => handleExportPreset(e, item),
                                className: "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1.5 rounded text-xs font-bold",
                                title: "匯出此單一教材為 JSON 檔案"
                            }, "📥"),
                            isAdmin && h("button", {
                                onClick: e => handleDeletePreset(e, item.id),
                                className: "text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded text-xs",
                                title: "從清單中刪除此教材"
                            }, "🗑️")
                        ),

                        h("div", { className: "flex items-center flex-wrap gap-1.5 mb-1 pr-24" },
                            h("span", { className: "text-xs font-bold text-gray-900" }, lang === "zh" ? item.title_zh : item.title_en),
                            item.difficulty && h("span", { className: "bg-blue-100 text-blue-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded" }, "L" + item.difficulty),
                            item.persona && item.persona !== "standard" && h("span", { className: "bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded" }, PERSONA_LABELS[item.persona] || item.persona),
                            hasPrebaked && h("span", { className: "bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded" }, "🎙️ 已內嵌真人語音"),
                            item.cls_guidelines && h("span", { className: "bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded" }, "📌 附專屬詞彙表")
                        ),
                        h("p", { className: "text-xs text-gray-600 line-clamp-2" }, lang === "zh" ? item.desc_zh : item.desc_en)
                    );
                })
            )
        );
    }

    // 子組件 4：右側模擬法庭及錄音操作區 (ActiveCourtroomPanel)
    function ActiveCourtroomPanel({
        TString, lang, currentCase, activeTurn, currentTurnIdx, practiceTurnsLimit,
        isBlindMode, isSourceTextHidden, currentTurnEval, peekTurnMap, setPeekTurnMap,
        isDeferredEvalMode, isSessionRevealed, pendingBgGradesCount, handleFinishAndRevealAll,
        openRouterApiKey, ttsModel, isPlayingTTS, playOriginalSound,
        isRecording, recordingTurn, handleSpeechRecognition, micError, setMicError,
        userTranslations, setUserTranslations, recordedUrls,
        isGrading, gradeStudentAnswer, onPrevTurn, onNextTurn, onOpenEditor
    }) {
        const bakedModelName = activeTurn.baked_model ? activeTurn.baked_model.split("/")[1] : "Pre-baked";
        const liveModelName = ttsModel.includes("/") ? ttsModel.split("/")[1] : ttsModel;
        const maxTurns = Math.min(practiceTurnsLimit, currentCase.dialogue.length);
        const isLastTurn = currentTurnIdx >= maxTurns - 1;
        const voiceProf = CLS_SERVICES.resolveVoiceProfile(activeTurn, currentCase, activeTurn.turn % 2 === 1 ? "questioner" : "answerer");

        return h("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col" },
            h("div", { className: "bg-blue-900 text-white px-5 py-3 flex justify-between items-center flex-wrap gap-2" },
                h("div", { className: "text-xs font-bold uppercase tracking-wider flex items-center flex-wrap gap-2" },
                    h("span", { className: "w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" }),
                    h("span", { className: "text-white" }, TString.courtRoom),
                    currentCase.difficulty && h("span", { className: "bg-blue-700 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded" }, "Level " + currentCase.difficulty),
                    currentCase.persona && currentCase.persona !== "standard" && h("span", { className: "bg-purple-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded" }, PERSONA_LABELS[currentCase.persona] || currentCase.persona),
                    isBlindMode && h("span", { className: "bg-amber-500 text-blue-900 text-[10px] font-extrabold px-2 py-0.5 rounded" }, "🎧 盲聽考核模式"),
                    isDeferredEvalMode && !isSessionRevealed && h("span", { className: "bg-indigo-400 text-blue-950 text-[10px] font-extrabold px-2 py-0.5 rounded" },
                        pendingBgGradesCount > 0 ? ("⏳ 背景預審中 (" + pendingBgGradesCount + " 題)...") : "⚡ 連貫實戰模式"
                    )
                ),
                h("div", { className: "flex items-center space-x-2" },
                    h("span", { className: "text-xs font-bold text-amber-400" }, lang === "zh" ? currentCase.title_zh : currentCase.title_en),
                    h("button", {
                        onClick: () => onOpenEditor(currentCase),
                        className: "bg-blue-800 hover:bg-blue-700 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-600 cursor-pointer",
                        title: "審訂對白、參考譯文或調整角色固定聲線"
                    }, "✏️ 審訂教材/聲線")
                )
            ),

            h("div", { className: "p-5 flex flex-col space-y-5" },
                h("div", { className: "bg-gray-50 rounded-xl p-5 border border-gray-200 flex justify-between items-start" },
                    h("div", { className: "space-y-2 flex-1" },
                        h("div", { className: "text-xs font-extrabold text-blue-900 uppercase flex items-center flex-wrap gap-2" },
                            h("span", null, lang === "zh" ? activeTurn.role_zh : activeTurn.role_en),
                            h("span", { className: "text-gray-500 font-normal" }, "Turn " + activeTurn.turn + " / " + maxTurns),
                            h("span", { className: "bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded font-bold" },
                                (voiceProf.gender === "female" ? "👩 女聲" : "👨 男聲") + (voiceProf.ageGroup === "elderly" ? " · 長者語速" : "")
                            ),
                            activeTurn.audio_base64
                                ? h("span", { className: "bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold" }, "📦 離線預載真人語音 (" + bakedModelName + ")")
                                : (openRouterApiKey.trim() && ttsModel !== "browser" && h("span", { className: "bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded font-bold" }, "🎙️ " + liveModelName + " 鎖定聲線發聲")),
                            isBlindMode && isSourceTextHidden && h("button", {
                                onClick: () => setPeekTurnMap(prev => ({ ...prev, [activeTurn.turn]: !prev[activeTurn.turn] })),
                                className: "ml-auto text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded transition-all cursor-pointer"
                            }, peekTurnMap[activeTurn.turn] ? TString.hidePeekBtn : TString.peekBtn)
                        ),

                        isSourceTextHidden
                            ? h("div", { className: "bg-amber-50/90 border border-dashed border-amber-300 rounded-lg p-3.5 text-xs font-bold text-amber-900 flex items-center justify-between" },
                                h("span", null, isDeferredEvalMode ? "🔒 盲聽實戰中：請聽取音頻並直接錄音作答。完成各輪問答並點擊「展開全卷 AI 檢討報告」後將自動揭曉所有原文及點評。" : TString.blindBanner)
                              )
                            : h("div", { className: "text-base font-bold text-gray-900 leading-relaxed animate-fade-in" },
                                activeTurn.lang === "en-US" ? activeTurn.text_en : activeTurn.text_zh
                              )
                    ),
                    h("button", {
                        onClick: () => playOriginalSound(activeTurn, activeTurn.turn % 2 === 1 ? "questioner" : "answerer"),
                        disabled: isPlayingTTS,
                        title: "點擊播放法庭原聲",
                        className: "bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-full p-3 transition-all ml-4 cursor-pointer disabled:opacity-50 shadow-sm"
                    }, isPlayingTTS ? h(Icons.Spinner) : h(Icons.Play))
                ),

                h("div", { className: "flex items-center justify-between border-t border-b border-gray-200 py-2 px-1 border-dashed" },
                    h("span", { className: "text-xs font-bold text-gray-700" },
                        TString.hearAndInterpret, " ",
                        h("span", { className: "text-amber-600 underline font-extrabold" }, activeTurn.lang === "en-US" ? TString.cantonese : TString.english)
                    )
                ),

                h("div", { className: "space-y-3" },
                    h("div", { className: "flex justify-between items-center" },
                        h("label", { className: "text-xs font-bold text-gray-800" }, TString.yourTranslation),
                        h("button", {
                            onClick: () => handleSpeechRecognition(activeTurn.turn, activeTurn.lang === "en-US" ? "zh-HK" : "en-US"),
                            className: "px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all text-white cursor-pointer " + (isRecording && recordingTurn === activeTurn.turn ? "bg-red-600 animate-pulse" : "bg-blue-900 hover:bg-blue-800")
                        },
                            h(Icons.Mic),
                            h("span", { className: "text-white" }, isRecording && recordingTurn === activeTurn.turn ? TString.stopRecord : TString.startRecord)
                        )
                    ),

                    micError && h("div", { className: "bg-rose-50 border border-rose-300 text-rose-800 rounded-lg p-3 text-xs whitespace-pre-line leading-relaxed flex justify-between items-start" },
                        h("div", null, micError),
                        h("button", { onClick: () => setMicError(""), className: "ml-3 text-rose-600 font-bold hover:text-rose-900" }, "✕")
                    ),

                    h("textarea", {
                        rows: "3",
                        value: userTranslations[activeTurn.turn] || "",
                        onChange: e => setUserTranslations(prev => ({ ...prev, [activeTurn.turn]: e.target.value })),
                        className: "w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm font-semibold text-gray-900",
                        placeholder: TString.textareaPlaceholder
                    }),

                    recordedUrls[activeTurn.turn] && h("div", { className: "bg-amber-50 border border-amber-300 rounded-lg p-3 flex flex-wrap gap-2 justify-between items-center shadow-inner" },
                        h("div", { className: "text-xs font-bold text-amber-900" }, TString.playback + " (已自動保存至下方課後檢討總表)"),
                        h("div", { className: "flex items-center space-x-4" },
                            h("audio", { controls: true, src: recordedUrls[activeTurn.turn], className: "h-8 max-w-xs outline-none" }),
                            h("a", {
                                href: recordedUrls[activeTurn.turn],
                                download: "Turn_" + activeTurn.turn + "_Audio.webm",
                                className: "text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline bg-white px-2 py-1 rounded border border-blue-200"
                            }, "⬇️ " + (lang === "zh" ? "單題下載" : "Save Audio"))
                        )
                    )
                ),

                h("div", { className: "flex justify-between items-center border-t border-gray-200 pt-4 flex-wrap gap-2" },
                    h("button", {
                        onClick: onPrevTurn,
                        disabled: currentTurnIdx === 0,
                        className: "border border-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg text-xs flex items-center space-x-1.5 disabled:opacity-40 cursor-pointer"
                    },
                        h(Icons.ArrowLeft),
                        h("span", null, TString.prevBtn)
                    ),

                    isDeferredEvalMode && !isSessionRevealed
                        ? h("button", {
                            onClick: handleFinishAndRevealAll,
                            disabled: isGrading,
                            className: "bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-6 rounded-lg text-xs flex items-center space-x-1.5 shadow disabled:opacity-50 cursor-pointer"
                        },
                            h("span", { className: "text-white" },
                                isGrading
                                    ? "⏳ 正在匯總全卷 AI 評核報告..."
                                    : "🏁 結束問答並展開全卷 AI 檢討報告"
                            )
                        )
                        : h("button", {
                            onClick: () => gradeStudentAnswer(activeTurn.turn, activeTurn, false),
                            disabled: isGrading,
                            className: "bg-amber-500 hover:bg-amber-600 text-blue-900 font-black py-2.5 px-6 rounded-lg text-xs flex items-center space-x-1.5 shadow disabled:opacity-50 cursor-pointer"
                        },
                            h(Icons.Check),
                            h("span", { className: "text-blue-900" }, isGrading ? TString.gradingBtn : (isSessionRevealed ? "🔄 重新 AI 點評此題" : TString.submitBtn))
                        ),

                    h("button", {
                        onClick: onNextTurn,
                        disabled: isLastTurn,
                        className: "bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center space-x-1.5 disabled:opacity-40 cursor-pointer"
                    },
                        h("span", { className: "text-white" }, isDeferredEvalMode && !isSessionRevealed ? "儲存並進入下一題 (背景預審)" : TString.nextBtn),
                        h(Icons.ArrowRight)
                    )
                )
            )
        );
    }

    // 子組件 5：AI 點評結果卡片 (EvaluationResultCard)
    function EvaluationResultCard({ TString, currentTurnEval, userTranslations, activeTurn, isDeferredEvalMode, isSessionRevealed, recordedUrl }) {
        if (!currentTurnEval || (isDeferredEvalMode && !isSessionRevealed)) return null;

        const isGlm = currentTurnEval.engine && currentTurnEval.engine !== "local";

        return h("div", { className: "bg-white rounded-xl p-5 border-2 border-blue-900 shadow-md space-y-4 animate-fade-in" },
            h("div", { className: "flex justify-between items-center border-b border-gray-200 pb-2 flex-wrap gap-2" },
                h("div", { className: "flex items-center space-x-3" },
                    h("h3", { className: "text-sm font-extrabold text-blue-900 uppercase" },
                        "📊 第 " + activeTurn.turn + " 題 — " + TString.aiEvalTitle
                    ),
                    recordedUrl && h("audio", { controls: true, src: recordedUrl, className: "h-7 max-w-[200px]" })
                ),
                h("span", {
                    className: "text-xs font-bold px-2.5 py-1 rounded " + (isGlm ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-700")
                }, isGlm ? ("⚡ AI 語意核證 (" + currentTurnEval.engine + ")") : "⚙️ 本地規則引擎 (離線備援)")
            ),
            h("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-relaxed" },
                h("div", { className: "bg-rose-50 border border-rose-200 rounded p-3 text-gray-900" },
                    h("div", { className: "font-extrabold text-rose-800 mb-1" }, TString.yourInput),
                    userTranslations[activeTurn.turn] || "---"
                ),
                h("div", { className: "bg-emerald-50 border border-emerald-200 rounded p-3 text-gray-900" },
                    h("div", { className: "font-extrabold text-emerald-800 mb-1" }, TString.suggestedAns),
                    activeTurn.lang === "en-US" ? activeTurn.targetText_zh : activeTurn.targetText_en
                )
            ),
            h("div", { className: "space-y-2 mt-4 text-sm text-gray-800" },
                h("div", { className: "font-bold text-emerald-700" }, TString.strengths),
                h("ul", { className: "list-disc pl-5" },
                    currentTurnEval.strengths.map((s, i) => h("li", { key: i }, s))
                ),
                h("div", { className: "font-bold text-rose-700 mt-2" }, TString.improvements),
                h("ul", { className: "list-disc pl-5" },
                    currentTurnEval.improvements.map((s, i) => h("li", { key: i }, s))
                )
            )
        );
    }

    // 子組件 6：自訂案情導入與綜合評估報告 Dashboard (ImporterAndDashboard)
    function ImporterAndDashboard({
        TString, lang, handleDocUpload, openRouterApiKey, setOpenRouterApiKey,
        customBriefText, setCustomBriefText, saveToCategory, setSaveToCategory,
        genVenue, setGenVenue, genDifficulty, setGenDifficulty,
        genPersona, setGenPersona, genCounselGender, setGenCounselGender,
        genWitnessGender, setGenWitnessGender,
        autoBakeOnGenerate, setAutoBakeOnGenerate,
        handleAISummonCourtroom, isGeneratingCase, activeDialogueSlice,
        handleOpenHTMLReport, handleDownloadSessionZip,
        avgAccuracy, avgTone, avgLegal, avgDelivery, finalOverallIndex,
        aiEvaluations, activeTurn, userTranslations, recordedUrls,
        isDeferredEvalMode, isSessionRevealed, handleFinishAndRevealAll, isGrading,
        onSelectTurnIdx
    }) {
        return h(Fragment, null,
            h("div", { className: "bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4" },
                h("div", { className: "flex justify-between items-center border-b border-gray-200 pb-2 flex-wrap gap-2" },
                    h("h2", { className: "text-sm font-bold text-blue-900 flex items-center space-x-2" },
                        h(Icons.Report),
                        h("span", { className: "text-blue-900 uppercase" }, TString.dashboardTitle + " 及課後錄音檢討總表 (共 " + activeDialogueSlice.length + " 題)")
                    ),
                    h("div", { className: "flex items-center flex-wrap gap-2" },
                        isDeferredEvalMode && !isSessionRevealed && h("button", {
                            onClick: handleFinishAndRevealAll,
                            disabled: isGrading,
                            className: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all shadow cursor-pointer disabled:opacity-50"
                        }, isGrading ? "⏳ 正在完成批改..." : "🔓 揭曉全卷分數與評語"),
                        h("button", {
                            onClick: handleDownloadSessionZip,
                            className: "bg-amber-500 hover:bg-amber-600 text-blue-950 font-extrabold py-1.5 px-3.5 rounded-lg text-xs flex items-center space-x-1 transition-all shadow cursor-pointer"
                        }, h("span", null, "📦 打包下載全套錄音及報告 (.zip)")),
                        h("button", {
                            onClick: handleOpenHTMLReport,
                            className: "bg-blue-900 hover:bg-blue-800 text-white font-bold py-1.5 px-4 rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow cursor-pointer"
                        }, h("span", { className: "text-white" }, TString.openCertBtn))
                    )
                ),

                (!isDeferredEvalMode || isSessionRevealed) ? h("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3 text-center" },
                    h("div", { className: "bg-gray-50 p-3 rounded border border-gray-200" },
                        h("div", { className: "text-xs font-bold text-gray-500 uppercase" }, TString.avgAcc),
                        h("div", { className: "text-base font-extrabold text-blue-900 mt-0.5" }, avgAccuracy, " ", h("span", { className: "text-xs text-gray-400" }, "/5.0"))
                    ),
                    h("div", { className: "bg-gray-50 p-3 rounded border border-gray-200" },
                        h("div", { className: "text-xs font-bold text-gray-500 uppercase" }, TString.avgTone),
                        h("div", { className: "text-base font-extrabold text-blue-900 mt-0.5" }, avgTone, " ", h("span", { className: "text-xs text-gray-400" }, "/5.0"))
                    ),
                    h("div", { className: "bg-gray-50 p-3 rounded border border-gray-200" },
                        h("div", { className: "text-xs font-bold text-gray-500 uppercase" }, TString.avgLegal),
                        h("div", { className: "text-base font-extrabold text-blue-900 mt-0.5" }, avgLegal, " ", h("span", { className: "text-xs text-gray-400" }, "/5.0"))
                    ),
                    h("div", { className: "bg-gray-50 p-3 rounded border border-gray-200" },
                        h("div", { className: "text-xs font-bold text-gray-500 uppercase" }, TString.avgDel),
                        h("div", { className: "text-base font-extrabold text-blue-900 mt-0.5" }, avgDelivery, " ", h("span", { className: "text-xs text-gray-400" }, "/5.0"))
                    ),
                    h("div", { className: "bg-blue-50 p-3 rounded border border-blue-200 col-span-2 md:col-span-1" },
                        h("div", { className: "text-xs font-bold text-blue-700 uppercase" }, TString.overallIdx),
                        h("div", { className: "text-base font-black text-blue-900 mt-0.5" }, finalOverallIndex, " ", h("span", { className: "text-xs text-blue-500" }, "/5.0"))
                    )
                ) : h("div", { className: "bg-indigo-50 border border-indigo-200 text-indigo-900 p-3 rounded-lg text-xs font-bold text-center" },
                    "🎧 連貫實戰進行中：各題錄音及譯文已在背景靜默預審。完成所有問答後，請點擊「🏁 結束問答並展開全卷 AI 檢討報告」以一併檢視所有得分、錄音回播及 AI 評語。"
                ),

                h("div", { className: "overflow-x-auto" },
                    h("table", { className: "w-full text-left text-xs border-collapse" },
                        h("thead", null,
                            h("tr", { className: "bg-gray-100 text-gray-700 font-bold border-b border-gray-200" },
                                h("th", { className: "p-2" }, "題號"),
                                h("th", { className: "p-2" }, "角色"),
                                h("th", { className: "p-2" }, "學員譯文摘要 (點擊該行檢視詳情)"),
                                h("th", { className: "p-2" }, "🎙️ 學員錄音回播"),
                                h("th", { className: "p-2 text-center" }, "Acc."),
                                h("th", { className: "p-2 text-center" }, "Tone"),
                                h("th", { className: "p-2 text-center" }, "Legal"),
                                h("th", { className: "p-2 text-center" }, "Deliv."),
                                h("th", { className: "p-2 text-center" }, "總分")
                            )
                        ),
                        h("tbody", null,
                            activeDialogueSlice.map((turn, i) => {
                                const scoreInfo = aiEvaluations[turn.turn];
                                const showScores = !isDeferredEvalMode || isSessionRevealed;
                                const isCurrent = turn.turn === activeTurn.turn;
                                const recUrl = recordedUrls[turn.turn];

                                let studentTextSnippet = userTranslations[turn.turn] || "---";
                                if (studentTextSnippet.length > 22) {
                                    studentTextSnippet = studentTextSnippet.substring(0, 22) + "...";
                                }

                                return h("tr", {
                                    key: i,
                                    onClick: () => onSelectTurnIdx(i),
                                    className: "border-b border-gray-200 cursor-pointer transition-all " + (isCurrent ? "bg-blue-50 font-bold text-blue-900" : "hover:bg-gray-50 text-gray-600")
                                },
                                    h("td", { className: "p-2" }, turn.turn),
                                    h("td", { className: "p-2 whitespace-nowrap" }, lang === "zh" ? turn.role_zh : turn.role_en),
                                    h("td", { className: "p-2 italic" }, studentTextSnippet),
                                    h("td", { className: "p-2", onClick: e => e.stopPropagation() },
                                        recUrl
                                            ? h("audio", { controls: true, src: recUrl, className: "h-7 w-40" })
                                            : h("span", { className: "text-gray-400 text-[11px]" }, "未錄音")
                                    ),
                                    h("td", { className: "p-2 text-center" }, (showScores && scoreInfo) ? scoreInfo.scores.accuracy : (scoreInfo ? "🔒已預審" : "-")),
                                    h("td", { className: "p-2 text-center" }, (showScores && scoreInfo) ? scoreInfo.scores.tone : "-"),
                                    h("td", { className: "p-2 text-center" }, (showScores && scoreInfo) ? scoreInfo.scores.legal : "-"),
                                    h("td", { className: "p-2 text-center" }, (showScores && scoreInfo) ? scoreInfo.scores.delivery : "-"),
                                    h("td", { className: "p-2 text-center font-bold text-blue-900" }, (showScores && scoreInfo) ? scoreInfo.scores.overall : "-")
                                );
                            })
                        )
                    )
                )
            ),

            // 自訂案情導入器 (升級：加入分級進階、場所、特種證人及角色聲線鎖定面板)
            h("div", { className: "bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4 animate-fade-in" },
                h("h2", { className: "text-sm font-bold text-blue-900 flex items-center space-x-2 border-b border-gray-200 pb-2" },
                    h("span", { className: "text-blue-900 uppercase" }, TString.customImportTitle + " — 分級與特種證人出題引擎")
                ),
                h("p", { className: "text-xs text-gray-600 leading-relaxed" },
                    "上載案情摘要或直接貼上控罪事實，並選擇目標「審訊場所」、「難易度分級」、「特種證人畫像」及「固定性別聲線」。生成後會自動彈出審訂工作坊。"
                ),

                // 分級與特種證人 5 格控制矩陣
                h("div", { className: "bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 grid grid-cols-1 md:grid-cols-5 gap-3" },
                    h("div", null,
                        h("label", { className: "block text-[11px] font-extrabold text-blue-900 mb-1" }, "🏛️ 1. 審訊場所 (Venue)"),
                        h("select", {
                            value: genVenue,
                            onChange: e => {
                                const v = e.target.value;
                                setGenVenue(v);
                                if (v === "tribunal") {
                                    setSaveToCategory("civil");
                                    setGenPersona("technical_tribunal");
                                }
                            },
                            className: "w-full text-xs font-bold p-2 border border-blue-300 rounded bg-white text-gray-900"
                        },
                            h("option", { value: "magistrates" }, "⚖️ 裁判法院 / 區域法院"),
                            h("option", { value: "tribunal" }, "🏛️ 審裁處 (勞資/土地/小額)")
                        )
                    ),
                    h("div", null,
                        h("label", { className: "block text-[11px] font-extrabold text-blue-900 mb-1" }, "📊 2. 難易度 (Difficulty)"),
                        h("select", {
                            value: genDifficulty,
                            onChange: e => setGenDifficulty(Number(e.target.value)),
                            className: "w-full text-xs font-bold p-2 border border-blue-300 rounded bg-white text-gray-900"
                        },
                            h("option", { value: 1 }, "Level 1: 基礎入門 (短句)"),
                            h("option", { value: 2 }, "Level 2: 常規實戰 (標準)"),
                            h("option", { value: 3 }, "Level 3: 進階高壓 (複合陷阱)")
                        )
                    ),
                    h("div", null,
                        h("label", { className: "block text-[11px] font-extrabold text-blue-900 mb-1" }, "🎭 3. 特種證人 (Persona)"),
                        h("select", {
                            value: genPersona,
                            onChange: e => setGenPersona(e.target.value),
                            className: "w-full text-xs font-bold p-2 border border-blue-300 rounded bg-white text-gray-900"
                        },
                            h("option", { value: "street_combative" }, "🔥 市井／情緒化證人"),
                            h("option", { value: "elderly_garrulous" }, "👵 長者／囉嗦迂迴證人"),
                            h("option", { value: "non_native" }, "🌏 少數族裔／非地道語法"),
                            h("option", { value: "technical_tribunal" }, "📐 審裁處／技術專家證人"),
                            h("option", { value: "standard" }, "👤 常規標準證人")
                        )
                    ),
                    h("div", null,
                        h("label", { className: "block text-[11px] font-extrabold text-blue-900 mb-1" }, "🎙️ 4. 律師/審裁官聲線"),
                        h("select", {
                            value: genCounselGender,
                            onChange: e => setGenCounselGender(e.target.value),
                            className: "w-full text-xs font-bold p-2 border border-blue-300 rounded bg-white text-gray-900"
                        },
                            h("option", { value: "male" }, "👨‍⚖️ 固定男聲 (Onyx / Ryan)"),
                            h("option", { value: "female" }, "👩‍⚖️ 固定女聲 (Alloy / Sonia)")
                        )
                    ),
                    h("div", null,
                        h("label", { className: "block text-[11px] font-extrabold text-blue-900 mb-1" }, "🎙️ 5. 證人/事主性別聲線"),
                        h("select", {
                            value: genWitnessGender,
                            onChange: e => setGenWitnessGender(e.target.value),
                            className: "w-full text-xs font-bold p-2 border border-blue-300 rounded bg-white text-gray-900"
                        },
                            h("option", { value: "auto" }, "🤖 依案情自動判斷 (如風化案女聲)"),
                            h("option", { value: "female" }, "👩 強制鎖定女聲"),
                            h("option", { value: "male" }, "👨 強制鎖定男聲")
                        )
                    )
                ),

                h("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                    h("div", { className: "space-y-2" },
                        h("label", { className: "block text-xs font-bold text-gray-500" }, TString.uploadFile),
                        h("input", {
                            type: "file",
                            accept: ".docx,.pdf,.txt,.json",
                            onChange: handleDocUpload,
                            className: "w-full text-xs border border-dashed border-gray-300 rounded-lg p-2.5 bg-gray-50 cursor-pointer text-gray-700"
                        })
                    ),
                    h("div", { className: "space-y-2" },
                        h("label", { className: "block text-xs font-bold text-gray-500" }, TString.apiKey),
                        h("input", {
                            type: "password",
                            placeholder: "sk-or-v1-... (OpenRouter Key)",
                            value: openRouterApiKey,
                            onChange: e => setOpenRouterApiKey(e.target.value),
                            className: "w-full text-xs p-2.5 border border-gray-300 rounded-lg text-gray-900"
                        })
                    )
                ),

                h("textarea", {
                    rows: "3",
                    placeholder: TString.importPlaceholder,
                    value: customBriefText,
                    onChange: e => setCustomBriefText(e.target.value),
                    className: "w-full text-xs border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-900 leading-relaxed text-gray-900"
                }),

                h("div", { className: "flex justify-between items-center flex-wrap gap-4" },
                    h("div", { className: "flex items-center flex-wrap gap-4" },
                        h("div", { className: "flex items-center space-x-2" },
                            h("label", { className: "text-xs font-bold text-gray-600" }, TString.category),
                            h("select", {
                                value: saveToCategory,
                                onChange: e => setSaveToCategory(e.target.value),
                                className: "bg-gray-50 border border-gray-300 rounded text-xs p-1.5 font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-900"
                            },
                                h("option", { value: "criminal" }, TString.criminal),
                                h("option", { value: "civil" }, TString.civil),
                                h("option", { value: "custom" }, TString.custom)
                            )
                        ),
                        h("label", { className: "flex items-center space-x-1.5 text-xs font-bold text-purple-900 cursor-pointer" },
                            h("input", {
                                type: "checkbox",
                                checked: autoBakeOnGenerate,
                                onChange: e => setAutoBakeOnGenerate(e.target.checked),
                                className: "rounded text-purple-700"
                            }),
                            h("span", null, "🎙️ 生成文字後立即按鎖定角色聲線合成全卷語音")
                        )
                    ),
                    h("button", {
                        onClick: handleAISummonCourtroom,
                        disabled: isGeneratingCase,
                        className: "bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
                    }, h("span", { className: "text-white" }, isGeneratingCase ? TString.generating : TString.generateBtn))
                )
            )
        );
    }

    // 主應用程式 App
    function App() {
        const [lang, setLang] = useState("zh");
        const [isInverted, setIsInverted] = useState(false);

        useEffect(() => {
            if (isInverted) {
                document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
                document.documentElement.style.backgroundColor = "#111";
            } else {
                document.documentElement.style.filter = "none";
                document.documentElement.style.backgroundColor = "";
            }
        }, [isInverted]);

        const [presets, setPresets] = useState(() => {
            const saved = localStorage.getItem("cls_custom_presets");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    return [...parsed, ...ORIGINAL_PRESETS];
                } catch (e) {
                    console.error("Failed to load local presets", e);
                    return ORIGINAL_PRESETS;
                }
            }
            return ORIGINAL_PRESETS;
        });

        useEffect(() => {
            const customPresets = presets.filter(p => p.id.startsWith("custom_"));
            try {
                localStorage.setItem("cls_custom_presets", JSON.stringify(customPresets));
            } catch (storageErr) {
                console.warn("localStorage quota exceeded. Use JSON or presets.js export for permanent storage.", storageErr);
            }
        }, [presets]);

        const [traineeName, setTraineeName] = useState(() => localStorage.getItem("cls_trainee_name") || "");
        const [traineeId, setTraineeId] = useState(() => localStorage.getItem("cls_trainee_id") || "");
        const [isBlindMode, setIsBlindMode] = useState(true);
        const [peekTurnMap, setPeekTurnMap] = useState({});

        const [isDeferredEvalMode, setIsDeferredEvalMode] = useState(true);
        const [isSessionRevealed, setIsSessionRevealed] = useState(false);
        const [pendingBgGradesCount, setPendingBgGradesCount] = useState(0);
        const [customRubric, setCustomRubric] = useState(() => {
            return localStorage.getItem("cls_custom_rubric") || CLS_SERVICES.DEFAULT_CLS_RUBRIC;
        });

        // 新增：分級進階、場所、特種證人與角色性別預選狀態
        const [genVenue, setGenVenue] = useState("magistrates");
        const [genDifficulty, setGenDifficulty] = useState(2);
        const [genPersona, setGenPersona] = useState("street_combative");
        const [genCounselGender, setGenCounselGender] = useState("male");
        const [genWitnessGender, setGenWitnessGender] = useState("auto");

        const [editingCaseModalData, setEditingCaseModalData] = useState(null);
        const [autoBakeOnGenerate, setAutoBakeOnGenerate] = useState(false);

        useEffect(() => { localStorage.setItem("cls_trainee_name", traineeName); }, [traineeName]);
        useEffect(() => { localStorage.setItem("cls_trainee_id", traineeId); }, [traineeId]);
        useEffect(() => { localStorage.setItem("cls_custom_rubric", customRubric); }, [customRubric]);

        const [bakingCaseId, setBakingCaseId] = useState(null);
        const [bakingProgress, setBakingProgress] = useState("");

        const [voices, setVoices] = useState([]);
        const [ speechRate, setSpeechRate] = useState(1.0);
        const [ttsModel, setTtsModel] = useState("fish-audio/s2.1-pro");
        const [isPlayingTTS, setIsPlayingTTS] = useState(false);

        const [practiceTurnsLimit, setPracticeTurnsLimit] = useState(20);
        const [isAdmin, setIsAdmin] = useState(false);

        const [currentCase, setCurrentCase] = useState(presets[0] || ORIGINAL_PRESETS[0]);
        const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
        const [userTranslations, setUserTranslations] = useState({});
        const [aiEvaluations, setAiEvaluations] = useState({});
        const [isGrading, setIsGrading] = useState(false);

        const activeTurn = currentCase.dialogue[currentTurnIdx] || {};
        const currentTurnEval = aiEvaluations[activeTurn.turn];
        const isTurnRevealed = isDeferredEvalMode ? isSessionRevealed : Boolean(currentTurnEval);
        const isSourceTextHidden = isBlindMode && !isTurnRevealed && !peekTurnMap[activeTurn.turn];

        const [isRecording, setIsRecording] = useState(false);
        const [recordingTurn, setRecordingTurn] = useState(null);
        const [recordedUrls, setRecordedUrls] = useState({});
        const [micError, setMicError] = useState("");

        const [customBriefText, setCustomBriefText] = useState("");
        const [isGeneratingCase, setIsGeneratingCase] = useState(false);
        const [saveToCategory, setSaveToCategory] = useState("criminal");
        const [openRouterApiKey, setOpenRouterApiKey] = useState(() => {
            return localStorage.getItem("cls_openrouter_api_key") || "";
        });

        useEffect(() => {
            localStorage.setItem("cls_openrouter_api_key", openRouterApiKey);
        }, [openRouterApiKey]);

        const recognitionRef = useRef(null);
        const mediaRecorderRef = useRef(null);
        const audioChunksRef = useRef([]);
        const micStreamRef = useRef(null);
        const ttsAudioPlayerRef = useRef(null);
        const ttsCacheRef = useRef({});

        const TString = T[lang];

        useEffect(() => {
            const loadVoices = () => {
                const allVoices = window.speechSynthesis.getVoices();
                const filtered = allVoices.filter(v => v.lang.toLowerCase().startsWith("en") || v.lang.toLowerCase().startsWith("zh") || v.lang.toLowerCase().includes("yue"));
                setVoices(filtered);
            };
            loadVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = loadVoices;
        }, []);

        const stopAllRecordingTracks = () => {
            if (recognitionRef.current) {
                try { recognitionRef.current.onend = null; recognitionRef.current.stop(); } catch (e) {}
                recognitionRef.current = null;
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                try { mediaRecorderRef.current.stop(); } catch (e) {}
            }
            if (micStreamRef.current) {
                micStreamRef.current.getTracks().forEach(track => track.stop());
                micStreamRef.current = null;
            }
            setIsRecording(false);
            setRecordingTurn(null);
        };

        useEffect(() => {
            return () => stopAllRecordingTracks();
        }, []);

        const handleUnlockAdmin = () => {
            if (isAdmin) {
                setIsAdmin(false);
                return;
            }
            const pass = prompt("請輸入管理員密碼解鎖管理員功能 (測試密碼: CLS2026)：");
            if (pass === "CLS2026") {
                setIsAdmin(true);
            } else if (pass !== null) {
                alert("密碼錯誤，拒絕存取！");
            }
        };

        const handleDeletePreset = (e, id) => {
            e.stopPropagation();
            if (confirm("確定要從教材庫中刪除此案件嗎？")) {
                const remaining = presets.filter(p => p.id !== id);
                setPresets(remaining);
                if (currentCase.id === id && remaining.length > 0) {
                    setCurrentCase(remaining[0]);
                    setCurrentTurnIdx(0);
                    setUserTranslations({});
                    setAiEvaluations({});
                    setRecordedUrls({});
                    setIsSessionRevealed(false);
                }
            }
        };

        const handleExportPreset = (e, item) => {
            if (e) e.stopPropagation();
            const jsonString = JSON.stringify(item, null, 2);
            const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", url);
            downloadAnchor.setAttribute("download", (item.id || "case_export") + ".json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            setTimeout(() => URL.revokeObjectURL(url), 5000);
        };

        const handleSaveEditedCase = (updatedCaseObj) => {
            setPresets(prev => {
                const exists = prev.some(p => p.id === updatedCaseObj.id);
                if (exists) {
                    return prev.map(p => p.id === updatedCaseObj.id ? updatedCaseObj : p);
                }
                return [updatedCaseObj, ...prev];
            });
            setCurrentCase(updatedCaseObj);
            setEditingCaseModalData(null);
        };

        // 預先合成全卷真人語音 (傳入 turn 與 caseItem 以鎖定每題角色性別與年齡聲線)
        const handlePrebakeCaseAudio = async (e, caseItem, skipConfirm = false) => {
            if (e) e.stopPropagation();
            const apiToUse = openRouterApiKey.trim();
            if (!apiToUse) {
                alert("請先在左側「訓練設定」輸入有效的 OpenRouter API 金鑰，方可預先合成全卷真人語音！");
                return;
            }
            if (ttsModel === "browser") {
                alert("請先在左側「法庭真人發聲引擎」選擇 OpenRouter 真人語音模型（例如 Fish Audio S2.1 Pro），而非瀏覽器內置發音。");
                return;
            }

            const totalTurns = caseItem.dialogue.length;
            if (!skipConfirm && !confirm("🎙️ 確定要按鎖定角色聲線為「" + caseItem.title_zh + "」合成全部 " + totalTurns + " 輪真人語音並打包成離線 JSON 教材嗎？")) {
                return;
            }

            setBakingCaseId(caseItem.id);
            try {
                const updatedDialogue = [];
                for (let i = 0; i < totalTurns; i++) {
                    const turn = caseItem.dialogue[i];
                    setBakingProgress("合成中 (" + (i + 1) + "/" + totalTurns + ")");

                    if (turn.audio_base64 && turn.baked_model === ttsModel) {
                        updatedDialogue.push(turn);
                        continue;
                    }

                    const textToSpeak = turn.lang === "en-US" ? turn.text_en : turn.text_zh;
                    const roleType = turn.turn % 2 === 1 ? "questioner" : "answerer";

                    const audioBlob = await CLS_SERVICES.requestOpenRouterTTSBlob(
                        textToSpeak,
                        turn.lang,
                        roleType,
                        apiToUse,
                        ttsModel,
                        turn,
                        caseItem
                    );
                    const base64AudioUrl = await CLS_SERVICES.blobToBase64(audioBlob);

                    updatedDialogue.push({
                        ...turn,
                        audio_base64: base64AudioUrl,
                        baked_model: ttsModel
                    });
                }

                const bakedCase = {
                    ...caseItem,
                    has_prebaked_audio: true,
                    baked_at: new Date().toISOString(),
                    baked_model: ttsModel,
                    dialogue: updatedDialogue
                };

                setPresets(prev => {
                    const exists = prev.some(p => p.id === bakedCase.id);
                    return exists ? prev.map(p => p.id === bakedCase.id ? bakedCase : p) : [bakedCase, ...prev];
                });
                setCurrentCase(bakedCase);
                setEditingCaseModalData(null);

                handleExportPreset(null, bakedCase);
                alert("✅ 固定聲線語音合成及打包完成！\n已自動下載帶有內嵌真人語音的 JSON 教材檔。");
            } catch (err) {
                console.error("Pre-baking audio failed:", err);
                alert("❌ 合成語音中途失敗：" + err.message);
            } finally {
                setBakingCaseId(null);
                setBakingProgress("");
            }
        };

        // 瀏覽器離線發聲備援（同樣支援根據性別與長者模式自動匹配女聲/男聲與語速）
        const playBrowserFallbackSound = (text, langCode, speakerRole, turnObj) => {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const prof = CLS_SERVICES.resolveVoiceProfile(turnObj, currentCase, speakerRole);

            const isCantonese = langCode === "zh-HK";
            const langVoices = voices.filter(v => isCantonese
                ? (v.lang.toLowerCase().includes("hk") || v.lang.toLowerCase().includes("yue") || v.lang.toLowerCase().includes("zh"))
                : v.lang.toLowerCase().startsWith("en")
            );

            let matchedVoice = null;
            if (prof.gender === "female") {
                matchedVoice = langVoices.find(v => /(female|hiumaan|hiugaai|sin-ji|ting|samantha|victoria|sonia|hazel|zira)/i.test(v.name));
            } else {
                matchedVoice = langVoices.find(v => /(male|wanlung|daniel|george|ryan|david|james|sam)/i.test(v.name));
            }
            if (!matchedVoice && langVoices.length > 0) {
                matchedVoice = langVoices[0];
            }

            if (matchedVoice) utterance.voice = matchedVoice;
            utterance.rate = Number((speechRate * prof.rateModifier).toFixed(2));
            utterance.lang = langCode;
            window.speechSynthesis.speak(utterance);
        };

        const playOriginalSound = async (turnObj, speakerRole) => {
            const text = turnObj.lang === "en-US" ? turnObj.text_en : turnObj.text_zh;
            const langCode = turnObj.lang;
            const prof = CLS_SERVICES.resolveVoiceProfile(turnObj, currentCase, speakerRole);
            const effectiveRate = Number((speechRate * prof.rateModifier).toFixed(2));

            window.speechSynthesis.cancel();
            if (ttsAudioPlayerRef.current) {
                ttsAudioPlayerRef.current.pause();
                ttsAudioPlayerRef.current = null;
            }

            if (turnObj.audio_base64) {
                const prebakedAudio = new Audio(turnObj.audio_base64);
                prebakedAudio.playbackRate = effectiveRate;
                ttsAudioPlayerRef.current = prebakedAudio;
                prebakedAudio.play();
                return;
            }

            const apiToUse = openRouterApiKey.trim();
            if (!apiToUse || ttsModel === "browser") {
                playBrowserFallbackSound(text, langCode, speakerRole, turnObj);
                return;
            }

            const cacheKey = ttsModel + "_" + langCode + "_" + prof.gender + "_" + prof.ageGroup + "_" + text;
            if (ttsCacheRef.current[cacheKey]) {
                const cachedAudio = new Audio(ttsCacheRef.current[cacheKey]);
                cachedAudio.playbackRate = effectiveRate;
                ttsAudioPlayerRef.current = cachedAudio;
                cachedAudio.play();
                return;
            }

            setIsPlayingTTS(true);
            try {
                const audioBlob = await CLS_SERVICES.requestOpenRouterTTSBlob(
                    text,
                    langCode,
                    speakerRole,
                    apiToUse,
                    ttsModel,
                    turnObj,
                    currentCase
                );
                const audioUrl = URL.createObjectURL(audioBlob);
                ttsCacheRef.current[cacheKey] = audioUrl;

                const audio = new Audio(audioUrl);
                audio.playbackRate = effectiveRate;
                ttsAudioPlayerRef.current = audio;
                await audio.play();
            } catch (err) {
                console.warn("OpenRouter Natural TTS failed, falling back to browser voice:", err);
                playBrowserFallbackSound(text, langCode, speakerRole, turnObj);
            } finally {
                setIsPlayingTTS(false);
            }
        };

        const handleSpeechRecognition = async (turnIdx, targetLangCode) => {
            setMicError("");

            if (isRecording) {
                stopAllRecordingTracks();
                return;
            }

            if (!window.isSecureContext) {
                setMicError("瀏覽器安全限制：目前並非處於 HTTPS 或 Localhost 安全環境（目前為 file:/// 本地檔案模式），瀏覽器基於安全政策會封鎖麥克風。若需錄音，請使用 VS Code Live Server 或上傳至 GitHub Pages (HTTPS) 打開。");
                return;
            }

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setMicError("此瀏覽器環境不支援 navigator.mediaDevices.getUserMedia 麥克風存取。");
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                try {
                    const rec = new SpeechRecognition();
                    recognitionRef.current = rec;
                    rec.continuous = true;
                    rec.interimResults = true;
                    rec.lang = targetLangCode;

                    rec.onresult = (event) => {
                        let finalTranscript = "";
                        for (let i = event.resultIndex; i < event.results.length; ++i) {
                            if (event.results[i].isFinal) {
                                finalTranscript += event.results[i][0].transcript;
                            }
                        }
                        if (finalTranscript) {
                            setUserTranslations(prev => ({
                                ...prev,
                                [turnIdx]: (prev[turnIdx] || "") + finalTranscript
                            }));
                        }
                    };

                    rec.onerror = (e) => {
                        console.warn("SpeechRecognition warning:", e.error);
                        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
                            setMicError("語音轉文字權限被拒絕 (SpeechRecognition: " + e.error + ")。請檢查網址列左側的「鎖頭/設定」圖示，將麥克風設為「允許」。");
                        }
                    };

                    rec.start();
                } catch (recErr) {
                    console.warn("Could not start SpeechRecognition synchronously:", recErr);
                }
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });

                micStreamRef.current = stream;
                audioChunksRef.current = [];

                const mimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", ""];
                const supportedMimeType = mimeTypes.find(type => type === "" || (window.MediaRecorder && MediaRecorder.isTypeSupported(type)));

                const recorder = supportedMimeType
                    ? new MediaRecorder(stream, { mimeType: supportedMimeType })
                    : new MediaRecorder(stream);

                mediaRecorderRef.current = recorder;

                recorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) {
                        audioChunksRef.current.push(e.data);
                    }
                };

                recorder.onstop = () => {
                    if (audioChunksRef.current.length > 0) {
                        const blobType = supportedMimeType || recorder.mimeType || "audio/webm";
                        const audioBlob = new Blob(audioChunksRef.current, { type: blobType });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        setRecordedUrls(prev => ({ ...prev, [turnIdx]: audioUrl }));
                    }
                    if (micStreamRef.current) {
                        micStreamRef.current.getTracks().forEach(track => track.stop());
                        micStreamRef.current = null;
                    }
                };

                recorder.start();
                setIsRecording(true);
                setRecordingTurn(turnIdx);

            } catch (err) {
                console.error("getUserMedia Microphone Error:", err);
                stopAllRecordingTracks();

                let detailMsg = "麥克風啟動失敗 (" + err.name + ": " + err.message + ")。";
                if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                    detailMsg = "⚠️ 麥克風存取被拒絕 (NotAllowedError)：\n1. 請點擊瀏覽器網址列左方的「鎖頭 / 調整圖示」允許麥克風權限。\n2. 若網頁嵌入於 iframe，外層 iframe 必須加上 allow=\"microphone\" 屬性。\n3. 請檢查電腦系統設定是否允許瀏覽器使用麥克風。";
                } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                    detailMsg = "⚠️ 找不到麥克風設備 (NotFoundError)：請確認耳機或麥克風已正確連接電腦。";
                } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
                    detailMsg = "⚠️ 麥克風正被其他程式獨佔 (NotReadableError)：請關閉其他正在使用麥克風的分頁或通訊軟件後重試。";
                }
                setMicError(detailMsg);
            }
        };

        const gradeStudentAnswer = async (turnIdx, turnData, silentBg = false) => {
            const answer = (userTranslations[turnIdx] || "").trim();
            const isEnSource = turnData.lang === "en-US";
            const targetText = isEnSource ? turnData.targetText_zh : turnData.targetText_en;
            const langDirection = isEnSource ? "en-to-zh" : "zh-to-en";
            const apiToUse = openRouterApiKey.trim();

            if (!answer || !apiToUse) {
                const localResult = CLS_SERVICES.evaluateTranslationQualityLocal(answer, targetText, langDirection);
                setAiEvaluations(prev => ({ ...prev, [turnIdx]: localResult }));
                return localResult;
            }

            if (silentBg) {
                setPendingBgGradesCount(c => c + 1);
            } else {
                setIsGrading(true);
            }

            try {
                const glmResult = await CLS_SERVICES.evaluateWithGLM(
                    answer,
                    turnData,
                    apiToUse,
                    "z-ai/glm-4.5-air",
                    customRubric,
                    currentCase.cls_guidelines || "",
                    {
                        difficulty: currentCase.difficulty || 2,
                        persona: currentCase.persona || "standard",
                        venue: currentCase.venue || "magistrates"
                    }
                );
                setAiEvaluations(prev => ({ ...prev, [turnIdx]: glmResult }));
                return glmResult;
            } catch (err) {
                console.warn("GLM grading failed, falling back to local heuristic engine:", err);
                const fallbackResult = CLS_SERVICES.evaluateTranslationQualityLocal(answer, targetText, langDirection);
                setAiEvaluations(prev => ({ ...prev, [turnIdx]: fallbackResult }));
                return fallbackResult;
            } finally {
                if (silentBg) {
                    setPendingBgGradesCount(c => Math.max(0, c - 1));
                } else {
                    setIsGrading(false);
                }
            }
        };

        const handleFinishAndRevealAll = async () => {
            stopAllRecordingTracks();
            setIsGrading(true);
            try {
                const activeSlice = currentCase.dialogue.slice(0, practiceTurnsLimit);
                const ungradedTurns = activeSlice.filter(t => {
                    const hasAns = (userTranslations[t.turn] || "").trim().length > 0;
                    const notGradedYet = !aiEvaluations[t.turn];
                    return hasAns && notGradedYet;
                });

                if (ungradedTurns.length > 0) {
                    await Promise.all(ungradedTurns.map(t => gradeStudentAnswer(t.turn, t, true)));
                }
                setIsSessionRevealed(true);
            } finally {
                setIsGrading(false);
            }
        };

        const handleDocUpload = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            if (file.name.endsWith(".json")) {
                reader.onload = (event) => {
                    try {
                        const parsed = JSON.parse(event.target.result);
                        if (parsed.dialogue && parsed.title_zh) {
                            const hasAudio = parsed.dialogue.some(d => Boolean(d.audio_base64));
                            const importedCase = {
                                ...parsed,
                                has_prebaked_audio: hasAudio,
                                id: parsed.id && parsed.id.startsWith("custom_") ? parsed.id : "custom_" + Date.now()
                            };
                            setPresets(prev => {
                                const filtered = prev.filter(p => p.id !== importedCase.id);
                                return [importedCase, ...filtered];
                            });
                            setCurrentCase(importedCase);
                            setCurrentTurnIdx(0);
                            setUserTranslations({});
                            setAiEvaluations({});
                            setRecordedUrls({});
                            setPeekTurnMap({});
                            setIsSessionRevealed(false);
                            alert("成功匯入教材：\n" + importedCase.title_zh + (hasAudio ? "\n🎙️ 偵測到內嵌真人語音包，可免 API Key 直接離線播放！" : ""));
                        } else {
                            alert("JSON 格式不符，必須包含 dialogue 與 title_zh 欄位。");
                        }
                    } catch (err) {
                        alert("JSON 解析失敗: " + err);
                    }
                };
                reader.readAsText(file);
            } else if (file.name.endsWith(".docx")) {
                reader.onload = (event) => {
                    mammoth.extractRawText({ arrayBuffer: event.target.result })
                        .then(res => setCustomBriefText(res.value))
                        .catch(err => alert("DOCX 解析失敗: " + err));
                };
                reader.readAsArrayBuffer(file);
            } else if (file.name.endsWith(".pdf")) {
                reader.onload = function () {
                    const typedarray = new Uint8Array(this.result);
                    pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                        let maxPages = pdf.numPages;
                        let countPromises = [];
                        for (let j = 1; j <= maxPages; j++) {
                            countPromises.push(
                                pdf.getPage(j).then(page => page.getTextContent().then(text => text.items.map(s => s.str).join(" ")))
                            );
                        }
                        Promise.all(countPromises).then(texts => setCustomBriefText(texts.join("\n")));
                    }).catch(err => alert("PDF 解析失敗: " + err));
                };
                reader.readAsArrayBuffer(file);
            } else {
                reader.onload = (event) => setCustomBriefText(event.target.result);
                reader.readAsText(file);
            }
        };

        const handleAISummonCourtroom = async () => {
            if (!customBriefText.trim()) {
                alert("請先貼上或上載案情細節文檔！");
                return;
            }

            setIsGeneratingCase(true);
            const apiToUse = openRouterApiKey.trim();
            const genConfig = {
                venue: genVenue,
                difficulty: genDifficulty,
                persona: genPersona,
                counselGender: genCounselGender,
                witnessGender: genWitnessGender
            };

            const finalizeNewCase = async (newCaseObj) => {
                setPresets(prev => [newCaseObj, ...prev]);
                setCurrentCase(newCaseObj);
                setCurrentTurnIdx(0);
                setUserTranslations({});
                setAiEvaluations({});
                setRecordedUrls({});
                setPeekTurnMap({});
                setIsSessionRevealed(false);

                if (autoBakeOnGenerate && apiToUse && ttsModel !== "browser") {
                    await handlePrebakeCaseAudio(null, newCaseObj, true);
                } else {
                    setEditingCaseModalData(newCaseObj);
                }
            };

            if (!apiToUse) {
                const mockObj = CLS_SERVICES.generateLocalMockCase(customBriefText, saveToCategory, genConfig);
                await finalizeNewCase(mockObj);
                setIsGeneratingCase(false);
                return;
            }

            try {
                const glmCase = await CLS_SERVICES.generateCaseWithGLM(customBriefText, saveToCategory, apiToUse, "z-ai/glm-4.5-air", genConfig);
                await finalizeNewCase(glmCase);
            } catch (err) {
                console.warn("OpenRouter GLM generation failed, fallback to local mock generator.", err);
                alert("GLM API 調用失敗，已自動切換為本地模擬生成。\n錯誤詳情: " + err.message);
                const mockObj = CLS_SERVICES.generateLocalMockCase(customBriefText, saveToCategory, genConfig);
                await finalizeNewCase(mockObj);
            } finally {
                setIsGeneratingCase(false);
            }
        };

        const activeDialogueSlice = currentCase.dialogue.slice(0, practiceTurnsLimit);
        let totalAccuracy = 0, totalTone = 0, totalLegal = 0, totalDelivery = 0, answeredCount = 0;

        activeDialogueSlice.forEach(turn => {
            if (aiEvaluations[turn.turn]) {
                totalAccuracy += aiEvaluations[turn.turn].scores.accuracy;
                totalTone += aiEvaluations[turn.turn].scores.tone;
                totalLegal += aiEvaluations[turn.turn].scores.legal;
                totalDelivery += aiEvaluations[turn.turn].scores.delivery;
                answeredCount++;
            }
        });

        const avgAccuracy = answeredCount ? (totalAccuracy / answeredCount).toFixed(1) : "0.0";
        const avgTone = answeredCount ? (totalTone / answeredCount).toFixed(1) : "0.0";
        const avgLegal = answeredCount ? (totalLegal / answeredCount).toFixed(1) : "0.0";
        const avgDelivery = answeredCount ? (totalDelivery / answeredCount).toFixed(1) : "0.0";
        const finalOverallIndex = answeredCount ? ((totalAccuracy + totalTone + totalLegal + totalDelivery) / (answeredCount * 4)).toFixed(1) : "0.0";

        return h("div", { className: "min-h-screen flex flex-col bg-transparent font-sans" },
            h(HeaderBar, {
                lang,
                setLang,
                isInverted,
                setIsInverted,
                TString
            }),

            h(CoursewareEditorModal, {
                editingCase: editingCaseModalData,
                onClose: () => setEditingCaseModalData(null),
                onSaveCase: handleSaveEditedCase,
                onSaveAndBakeAudio: (updatedDraft) => {
                    handleSaveEditedCase(updatedDraft);
                    handlePrebakeCaseAudio(null, updatedDraft, true);
                },
                isBaking: Boolean(bakingCaseId)
            }),

            h("div", { className: "flex-1 grid grid-cols-12 gap-6 p-6" },
                h("div", { className: "col-span-12 lg:col-span-4 flex flex-col space-y-6" },
                    h(TrainerConfigPanel, {
                        TString,
                        traineeName,
                        setTraineeName,
                        traineeId,
                        setTraineeId,
                        isBlindMode,
                        setIsBlindMode,
                        isDeferredEvalMode,
                        setIsDeferredEvalMode,
                        customRubric,
                        setCustomRubric,
                        practiceTurnsLimit,
                        setPracticeTurnsLimit,
                        speechRate,
                        setSpeechRate,
                        ttsModel,
                        setTtsModel,
                        openRouterApiKey,
                        setOpenRouterApiKey,
                        onTurnReset: () => {
                            stopAllRecordingTracks();
                            setCurrentTurnIdx(0);
                            setIsSessionRevealed(false);
                        }
                    }),

                    h(PresetLibraryPanel, {
                        TString,
                        lang,
                        presets,
                        currentCase,
                        isAdmin,
                        handleUnlockAdmin,
                        bakingCaseId,
                        bakingProgress,
                        handlePrebakeCaseAudio,
                        handleExportPreset,
                        handleDeletePreset,
                        onOpenEditor: (item) => setEditingCaseModalData(item),
                        onExportFullPresetsJs: () => CLS_SERVICES.exportFullPresetsJsFile(presets, T),
                        onSelectCase: (item) => {
                            stopAllRecordingTracks();
                            setCurrentCase(item);
                            setCurrentTurnIdx(0);
                            setUserTranslations({});
                            setAiEvaluations({});
                            setRecordedUrls({});
                            setPeekTurnMap({});
                            setIsSessionRevealed(false);
                        }
                    })
                ),

                h("div", { className: "col-span-12 lg:col-span-8 flex flex-col space-y-6" },
                    h(ActiveCourtroomPanel, {
                        TString,
                        lang,
                        currentCase,
                        activeTurn,
                        currentTurnIdx,
                        practiceTurnsLimit,
                        isBlindMode,
                        isSourceTextHidden,
                        currentTurnEval,
                        peekTurnMap,
                        setPeekTurnMap,
                        isDeferredEvalMode,
                        isSessionRevealed,
                        pendingBgGradesCount,
                        handleFinishAndRevealAll,
                        openRouterApiKey,
                        ttsModel,
                        isPlayingTTS,
                        playOriginalSound,
                        isRecording,
                        recordingTurn,
                        handleSpeechRecognition,
                        micError,
                        setMicError,
                        userTranslations,
                        setUserTranslations,
                        recordedUrls,
                        isGrading,
                        gradeStudentAnswer,
                        onOpenEditor: (item) => setEditingCaseModalData(item),
                        onPrevTurn: () => {
                            stopAllRecordingTracks();
                            setCurrentTurnIdx(prev => Math.max(0, prev - 1));
                        },
                        onNextTurn: () => {
                            stopAllRecordingTracks();
                            if (isDeferredEvalMode && (userTranslations[activeTurn.turn] || "").trim() && !aiEvaluations[activeTurn.turn]) {
                                gradeStudentAnswer(activeTurn.turn, activeTurn, true);
                            }
                            setCurrentTurnIdx(prev => Math.min(Math.min(practiceTurnsLimit, currentCase.dialogue.length) - 1, prev + 1));
                        }
                    }),

                    h(EvaluationResultCard, {
                        TString,
                        currentTurnEval,
                        userTranslations,
                        activeTurn,
                        isDeferredEvalMode,
                        isSessionRevealed,
                        recordedUrl: recordedUrls[activeTurn.turn]
                    }),

                    h(ImporterAndDashboard, {
                        TString,
                        lang,
                        handleDocUpload,
                        openRouterApiKey,
                        setOpenRouterApiKey,
                        customBriefText,
                        setCustomBriefText,
                        saveToCategory,
                        setSaveToCategory,
                        genVenue,
                        setGenVenue,
                        genDifficulty,
                        setGenDifficulty,
                        genPersona,
                        setGenPersona,
                        genCounselGender,
                        setGenCounselGender,
                        genWitnessGender,
                        setGenWitnessGender,
                        autoBakeOnGenerate,
                        setAutoBakeOnGenerate,
                        handleAISummonCourtroom,
                        isGeneratingCase,
                        activeDialogueSlice,
                        handleOpenHTMLReport: () => CLS_SERVICES.openHTMLReport({
                            currentCase,
                            practiceTurnsLimit,
                            aiEvaluations,
                            userTranslations,
                            traineeName,
                            traineeId,
                            isBlindMode
                        }),
                        handleDownloadSessionZip: () => CLS_SERVICES.exportStudentSessionZip({
                            currentCase,
                            practiceTurnsLimit,
                            aiEvaluations,
                            userTranslations,
                            recordedUrls,
                            traineeName,
                            traineeId,
                            isBlindMode
                        }),
                        avgAccuracy,
                        avgTone,
                        avgLegal,
                        avgDelivery,
                        finalOverallIndex,
                        aiEvaluations,
                        activeTurn,
                        userTranslations,
                        recordedUrls,
                        isDeferredEvalMode,
                        isSessionRevealed,
                        handleFinishAndRevealAll,
                        isGrading,
                        onSelectTurnIdx: (i) => {
                            stopAllRecordingTracks();
                            setCurrentTurnIdx(i);
                        }
                    })
                )
            ),

            h("footer", { className: "bg-gray-100 border-t border-gray-200 py-4 text-center text-xs text-gray-500" },
                "© 2026 法庭語文組 (Court Language Section) - 實戰口譯及 AI 核證質素培訓模擬系統。"
            )
        );
    }

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(h(App));
})();