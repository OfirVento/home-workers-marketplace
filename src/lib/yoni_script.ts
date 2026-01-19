import { Step, FLOW_IDS } from './types';

// Helper to create simple text steps
const textStep = (id: string, text: string, nextId: string, saveField?: string): Step => ({
    id,
    text,
    inputType: 'text',
    next: () => nextId,
    saveField
});

// Helper for button steps
const buttonStep = (id: string, text: string, buttons: string[], nextMap: Record<string, string> | string, saveField?: string): Step => ({
    id,
    text,
    buttons,
    inputType: 'buttons',
    next: (ans) => typeof nextMap === 'string' ? nextMap : (nextMap[ans] || nextMap['default'] || nextMap[Object.keys(nextMap)[0]]),
    saveField
});

// --- Candidates Data (Mock) ---
const CANDIDATE_1 = `כרטיס מועמד/ת:
שם: שרה כהן | ⭐️ 4.9
אזור: תל אביב והמרכז
זמינות: מיידית
מתאים ל: ניקיון, סידור בתים
מאומת/ת: תעודת זהות + 2 המלצות אומתו
מחיר: ₪65/שעה | מינימום: 4 שעות`;

const RECS_1 = `הנה מה שאומרים על שרה:

💬 *מיכל, תל אביב* (מעסיקה שנתיים):
"שרה מדהימה, מגיעה תמיד בזמן ומנקה פינות שלא ידעתי שקיימות."

💬 *רון, גבעתיים* (מעסיק שנה):
"ראש גדול, אפשר לסמוך עליה בעיניים עצומות. היא גם מסדרת נהדר."

ותק ממוצע אצל לקוחות: 1.5 שנים.
דירוג אמינות: 100% (ללא ביטולים החודש)`;

const CANDIDATE_2 = `כרטיס מועמד/ת (גיבוי 1):
שם: נועה לוי | ⭐️ 4.8
אזור: תל אביב
זמינות: מחר בבוקר
מתאים ל: ניקיון יסודי
מחיר: ₪70/שעה`;

const CANDIDATE_3 = `כרטיס מועמד/ת (גיבוי 2):
שם: דניאל אברהמי | ⭐️ 4.7
אזור: תל אביב ורמת גן
זמינות: גמיש
מחיר: ₪60/שעה`;


export const YONI_SCRIPT: Record<string, Step> = {
    // === 0) Welcome ===
    [FLOW_IDS.WELCOME]: {
        id: FLOW_IDS.WELCOME,
        text: "היי 👋 אני יוני.\nנעזור לכם למצוא עובד/ת בית מאומת/ת בהתאם לצורך — מהר ובסדר.\nנתחיל בשאלה אחת.",
        buttons: ["להתחיל", "יש לי שאלה"],
        inputType: 'buttons',
        next: (ans) => ans === "להתחיל" ? FLOW_IDS.CATEGORY : 'FAQ_START'
    },
    'FAQ_START': {
        id: 'FAQ_START',
        text: "בטח 🙂 כתבו כאן מה תרצו לדעת.",
        inputType: 'text',
        next: () => 'FAQ_FOLLOWUP'
    },
    'FAQ_FOLLOWUP': {
        id: 'FAQ_FOLLOWUP',
        text: "רוצים להתחיל התאמה?",
        buttons: ["להתחיל", "לא עכשיו"],
        inputType: 'buttons',
        next: (ans) => ans === "להתחיל" ? FLOW_IDS.CATEGORY : 'IDLE'
    },

    // === 1) Category ===
    [FLOW_IDS.CATEGORY]: {
        id: FLOW_IDS.CATEGORY,
        text: "מה אתם מחפשים?",
        buttons: ["ניקיון קבוע", "עוזרת אחה״צ עם ילדים", "בייביסיטר", "הכנת אוכל בבית", "גינה / תחזוקה קלה"],
        inputType: 'buttons',
        saveField: 'category',
        next: (ans) => {
            if (ans.includes("ניקיון")) return FLOW_IDS.CLEANING_CITY;
            if (ans.includes("עוזרת")) return FLOW_IDS.NANNY_CITY;
            if (ans.includes("בייביסיטר")) return FLOW_IDS.BABY_CITY;
            if (ans.includes("אוכל")) return FLOW_IDS.FOOD_CITY;
            if (ans.includes("גינה")) return FLOW_IDS.GARDEN_CITY;
            return FLOW_IDS.CATEGORY;
        }
    },

    // === 2) Flows (Condensed for brevity, same logic) ===
    [FLOW_IDS.CLEANING_CITY]: textStep(FLOW_IDS.CLEANING_CITY, "באיזה יישוב אתם?", FLOW_IDS.CLEANING_AREA, "city"),
    [FLOW_IDS.CLEANING_AREA]: { id: FLOW_IDS.CLEANING_AREA, text: "איזה אזור/שכונה? (אופציונלי)", buttons: ["לדלג"], inputType: 'mixed', saveField: "area", next: () => FLOW_IDS.CLEANING_FREQ },
    [FLOW_IDS.CLEANING_FREQ]: { id: FLOW_IDS.CLEANING_FREQ, text: "באיזו תדירות?", buttons: ["פעם בשבוע", "פעם בשבועיים", "אחר"], inputType: 'buttons', saveField: "frequency", next: (ans) => ans === "אחר" ? FLOW_IDS.CLEANING_FREQ_OTHER : FLOW_IDS.CLEANING_DAYS },
    [FLOW_IDS.CLEANING_FREQ_OTHER]: textStep(FLOW_IDS.CLEANING_FREQ_OTHER, "כתבו תדירות", FLOW_IDS.CLEANING_DAYS, "frequency_other"),
    [FLOW_IDS.CLEANING_DAYS]: { id: FLOW_IDS.CLEANING_DAYS, text: "באילו ימים הכי נוח?", buttons: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "גמיש/ה"], inputType: 'buttons', isMultiSelect: true, saveField: "days", next: () => FLOW_IDS.CLEANING_TIME },
    [FLOW_IDS.CLEANING_TIME]: { id: FLOW_IDS.CLEANING_TIME, text: "באיזה חלון זמן?", buttons: ["בוקר", "צהריים", "אחה״צ"], inputType: 'buttons', saveField: "time_window", next: () => FLOW_IDS.CLEANING_SIZE },
    [FLOW_IDS.CLEANING_SIZE]: buttonStep(FLOW_IDS.CLEANING_SIZE, "גודל הבית?", ["עד 3 חדרים", "4 חדרים", "5+ חדרים", "לא בטוח/ה"], FLOW_IDS.CLEANING_EXTRAS, "home_size"),
    [FLOW_IDS.CLEANING_EXTRAS]: buttonStep(FLOW_IDS.CLEANING_EXTRAS, "האם תרצו גם תוספות?", ["כביסה/קיפול", "סדר וארונות", "לא, רק ניקיון"], FLOW_IDS.CLEANING_NOTES, "extras"),
    [FLOW_IDS.CLEANING_NOTES]: buttonStep(FLOW_IDS.CLEANING_NOTES, "יש דגשים חשובים?", ["יש חיות בבית", "יש ילדים בבית", "אלרגיות", "שפה מועדפת", "אין"], FLOW_IDS.CLEANING_DONE, "notes_tags"),
    [FLOW_IDS.CLEANING_DONE]: buttonStep(FLOW_IDS.CLEANING_DONE, "תודה! קיבלתי 😊\nנחזור אליכם עם אופציות מאומתות בהקדם.", ["אוקיי"], FLOW_IDS.MATCH_FOUND_PREFIX),

    [FLOW_IDS.NANNY_CITY]: textStep(FLOW_IDS.NANNY_CITY, "באיזה יישוב?", FLOW_IDS.NANNY_DONE),
    [FLOW_IDS.NANNY_DONE]: buttonStep(FLOW_IDS.NANNY_DONE, "תודה! נחזור אליכם.", ["אוקיי"], FLOW_IDS.MATCH_FOUND_PREFIX),
    [FLOW_IDS.BABY_CITY]: textStep(FLOW_IDS.BABY_CITY, "באיזה יישוב?", FLOW_IDS.BABY_DONE),
    [FLOW_IDS.BABY_DONE]: buttonStep(FLOW_IDS.BABY_DONE, "תודה! נחזור אליכם.", ["אוקיי"], FLOW_IDS.MATCH_FOUND_PREFIX),
    [FLOW_IDS.FOOD_CITY]: textStep(FLOW_IDS.FOOD_CITY, "באיזה יישוב?", FLOW_IDS.FOOD_DONE),
    [FLOW_IDS.FOOD_DONE]: buttonStep(FLOW_IDS.FOOD_DONE, "תודה! נחזור אליכם.", ["אוקיי"], FLOW_IDS.MATCH_FOUND_PREFIX),
    [FLOW_IDS.GARDEN_CITY]: textStep(FLOW_IDS.GARDEN_CITY, "באיזה יישוב?", FLOW_IDS.GARDEN_DONE),
    [FLOW_IDS.GARDEN_DONE]: buttonStep(FLOW_IDS.GARDEN_DONE, "תודה! נחזור אליכם.", ["אוקיי"], FLOW_IDS.MATCH_FOUND_PREFIX),

    // ============================================
    // === PHASE 3: Matches (Rich Content) ===
    // ============================================

    [FLOW_IDS.MATCH_FOUND_PREFIX]: {
        id: FLOW_IDS.MATCH_FOUND_PREFIX,
        text: "(לאחר 24 שעות...)\nהיי, מצאנו לך מועמדת מובילה שמתאימה בול!",
        buttons: ["הצג מועמדת"],
        inputType: 'buttons',
        next: () => FLOW_IDS.MATCH_CARD_1
    },

    // Merged Image + Text + Buttons steps
    [FLOW_IDS.MATCH_CARD_1]: {
        id: FLOW_IDS.MATCH_CARD_1,
        imageArg: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: CANDIDATE_1,
        buttons: ["לקבוע שיחת היכרות", "לקבוע ניסיון/ביקור", "צפה בהמלצות (2) ⭐️", "לא מתאים"],
        inputType: 'buttons',
        next: (ans) => {
            if (ans.includes("ניסיון/ביקור")) return FLOW_IDS.SCHEDULE_WHEN;
            if (ans.includes("המלצות")) return FLOW_IDS.MATCH_CARD_1_RECS;
            if (ans.includes("לא מתאים")) return FLOW_IDS.BACKUP_OFFER_CARD_1;
            return FLOW_IDS.SCHEDULE_WHEN;
        }
    },

    [FLOW_IDS.MATCH_CARD_1_RECS]: {
        id: FLOW_IDS.MATCH_CARD_1_RECS,
        text: RECS_1,
        buttons: ["השתכנעתי, לקבוע ביקור", "חזרה לכרטיס"],
        inputType: 'buttons',
        next: (ans) => ans.includes("לקבוע") ? FLOW_IDS.SCHEDULE_WHEN : FLOW_IDS.MATCH_CARD_1
    },

    // === Phase 4: Scheduling ===
    [FLOW_IDS.SCHEDULE_WHEN]: {
        id: FLOW_IDS.SCHEDULE_WHEN,
        text: "מעולה. מתי נוח ביום ג׳?",
        buttons: ["10:00", "14:00", "אחר"],
        inputType: 'buttons',
        next: (ans) => ans === "אחר" ? FLOW_IDS.SCHEDULE_WHEN_OTHER : FLOW_IDS.SCHEDULE_ADDRESS
    },
    [FLOW_IDS.SCHEDULE_WHEN_OTHER]: textStep(FLOW_IDS.SCHEDULE_WHEN_OTHER, "כתבו תאריך ושעה", FLOW_IDS.SCHEDULE_ADDRESS, "schedule_custom"),

    [FLOW_IDS.SCHEDULE_ADDRESS]: textStep(FLOW_IDS.SCHEDULE_ADDRESS, "כתובת מלאה?", FLOW_IDS.SCHEDULE_CONFIRM, "address"),

    [FLOW_IDS.SCHEDULE_CONFIRM]: {
        id: FLOW_IDS.SCHEDULE_CONFIRM,
        text: "אישור סופי?",
        buttons: ["לאשר", "לבטל"],
        inputType: 'buttons',
        next: (ans) => ans === "לאשר" ? FLOW_IDS.SCHEDULE_DONE : FLOW_IDS.CANCEL_OFFER
    },

    [FLOW_IDS.SCHEDULE_DONE]: {
        id: FLOW_IDS.SCHEDULE_DONE,
        text: "סגרנו ✅\nנקבע עם שרה.\nאם יש שינוי — כתבו כאן.",
        buttons: ["(סימולציה: הרץ פידבק אחרי ביקור)"],
        inputType: 'buttons',
        next: () => FLOW_IDS.FEEDBACK_START
    },

    // === Phase 5: Feedback & Backup Loops ===
    [FLOW_IDS.FEEDBACK_START]: {
        id: FLOW_IDS.FEEDBACK_START,
        text: "(לאחר הביקור)\nאיך היה עם שרה?",
        buttons: ["⭐️1", "⭐️2", "⭐️3", "⭐️4", "⭐️5"],
        inputType: 'buttons',
        saveField: "rating",
        next: () => FLOW_IDS.FEEDBACK_PUNCTUALITY
    },
    [FLOW_IDS.FEEDBACK_PUNCTUALITY]: {
        id: FLOW_IDS.FEEDBACK_PUNCTUALITY,
        text: "האם הגיע/ה בזמן?",
        buttons: ["כן", "איחר/ה", "לא הגיע/ה"],
        inputType: 'buttons',
        saveField: "punctuality",
        next: (ans) => ans === "לא הגיע/ה" ? FLOW_IDS.BACKUP_OFFER_CARD_1 : FLOW_IDS.FEEDBACK_CONTINUE
    },
    [FLOW_IDS.FEEDBACK_CONTINUE]: {
        id: FLOW_IDS.FEEDBACK_CONTINUE,
        text: "להמשיך איתה?",
        buttons: ["כן, לקבוע קבוע", "עוד ניסיון", "לא מתאים"],
        inputType: 'buttons',
        next: (ans) => ans.includes("לקבוע קבוע") ? FLOW_IDS.FEEDBACK_SETUP_REGULAR :
            (ans.includes("לא מתאים") ? FLOW_IDS.BACKUP_OFFER_CARD_1 : 'FINAL_THANKS')
    },
    [FLOW_IDS.FEEDBACK_SETUP_REGULAR]: textStep(FLOW_IDS.FEEDBACK_SETUP_REGULAR, "מעולה. באילו ימים ושעות לקבוע קבוע?", 'FINAL_THANKS', "regular_slots"),

    'FINAL_THANKS': {
        id: 'FINAL_THANKS',
        text: "תודה! הקביעות עודכנה ✅",
        inputType: 'buttons',
        buttons: ["התחל מחדש"],
        next: () => FLOW_IDS.WELCOME
    },

    // === Backup / Alternatives Flow ===
    // Merged image steps with text/buttons
    [FLOW_IDS.BACKUP_OFFER_CARD_1]: {
        id: FLOW_IDS.BACKUP_OFFER_CARD_1,
        text: "מצטער לשמוע. אל דאגה, הכנתי מראש 2 אפשרויות גיבוי זמינות:\n\n" + CANDIDATE_2,
        imageArg: 'https://randomuser.me/api/portraits/women/68.jpg',
        buttons: ["לקבוע עם נועה", "לראות את הבאה"],
        inputType: 'buttons',
        next: (ans) => ans.includes("לקבוע") ? FLOW_IDS.SCHEDULE_WHEN : FLOW_IDS.BACKUP_OFFER_CARD_2
    },

    [FLOW_IDS.BACKUP_OFFER_CARD_2]: {
        id: FLOW_IDS.BACKUP_OFFER_CARD_2,
        text: CANDIDATE_3,
        imageArg: 'https://randomuser.me/api/portraits/men/32.jpg',
        buttons: ["לקבוע עם דניאל", "התחל מחדש"],
        inputType: 'buttons',
        next: (ans) => ans.includes("לקבוע") ? FLOW_IDS.SCHEDULE_WHEN : FLOW_IDS.WELCOME
    },

    // === Cancel ===
    [FLOW_IDS.CANCEL_OFFER]: {
        id: FLOW_IDS.CANCEL_OFFER,
        text: "רוצים שנמצא חלופה?",
        buttons: ["כן, למצוא חלופה", "לא, אסתדר"],
        inputType: 'buttons',
        next: (ans) => ans.includes("כן") ? FLOW_IDS.CANCEL_SEARCHING : 'FINAL_THANKS'
    },
    [FLOW_IDS.CANCEL_SEARCHING]: {
        id: FLOW_IDS.CANCEL_SEARCHING,
        text: "מעולה. הנה אפשרויות מיידיות:",
        imageArg: 'https://randomuser.me/api/portraits/women/68.jpg',
        buttons: ["הצג אפשרויות"],
        inputType: 'buttons',
        next: () => FLOW_IDS.BACKUP_OFFER_CARD_1
    }
};
