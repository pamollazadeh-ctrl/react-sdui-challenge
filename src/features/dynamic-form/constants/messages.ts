/**
 * Every user-facing string of the feature lives here (the UI is Persian / RTL),
 * so copy changes and a future i18n layer touch one file.
 */
/** Isolates left-to-right text ("5 MB") so it is not reordered inside a Persian sentence. */
const ltr = (text: string): string => `\u2066${text}\u2069`;

export const messages = {
  required: "این فیلد الزامی است",
  minLength: (min: number) => `حداقل ${min} کاراکتر وارد کنید`,
  maxLength: (max: number) => `حداکثر ${max} کاراکتر مجاز است`,
  invalidNumber: "یک عدد معتبر وارد کنید",
  min: (min: number) => `مقدار نباید کمتر از ${min} باشد`,
  max: (max: number) => `مقدار نباید بیشتر از ${max} باشد`,
  invalidOption: "یکی از گزینه‌های موجود را انتخاب کنید",
  singleFile: "فقط یک فایل مجاز است",
  fileType: (name: string) => `فرمت فایل «${name}» مجاز نیست`,
  fileSize: (name: string, limit: string) =>
    `حجم فایل «${name}» بیشتر از ${ltr(limit)} است`,

  selectPlaceholder: "انتخاب کنید",
  chooseFile: "انتخاب فایل",
  removeFile: (name: string) => `حذف ${name}`,
  maxFileSizeHint: (limit: string) => `حداکثر حجم هر فایل: ${ltr(limit)}`,

  submit: "ارسال",
  loadingForm: "در حال دریافت فرم…",
  loadFailed: "دریافت فرم با خطا مواجه شد.",
  retry: "تلاش دوباره",
  emptyForm: "این فرم فیلدی برای نمایش ندارد.",
  submitSucceeded: "اطلاعات با موفقیت ثبت شد.",
  submitFailed: "ارسال اطلاعات با خطا مواجه شد. دوباره تلاش کنید.",
  submitRejected: "برخی از فیلدها نیاز به اصلاح دارند.",
} as const;
