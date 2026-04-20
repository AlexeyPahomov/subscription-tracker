const mobileDialogWidthClass = '[--g-dialog-width:calc(100vw-40px)]';
const desktopDialogWidthClass = 'sm:[--g-dialog-width:min(94vw,var(--_--width))]';

const mobileDialogPaddingClass = '[--_--side-padding:16px]';
const desktopDialogPaddingClass = 'sm:[--_--side-padding:32px]';

export const responsiveDialogClass = [
  mobileDialogWidthClass,
  desktopDialogWidthClass,
  mobileDialogPaddingClass,
  desktopDialogPaddingClass,
].join(' ');
export const responsiveDialogModalClass = 'z-40!';

export const responsiveDialogBaseProps = {
  disableBodyScrollLock: true,
  contentOverflow: 'auto' as const,
  className: responsiveDialogClass,
  modalClassName: responsiveDialogModalClass,
};

export const responsiveDialogBodyClass =
  'pt-2 max-h-[min(72dvh,640px)] overflow-y-auto overflow-x-hidden';

export const responsiveDialogActionsClass =
  'flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3';
