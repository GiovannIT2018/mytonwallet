import type { RefObject } from 'react';
import React, { memo, useState } from '../../lib/teact/teact';

import buildClassName from '../../util/buildClassName';

import useLastCallback from '../../hooks/useLastCallback';
import useShowTransition from '../../hooks/useShowTransition';

import styles from './Button.module.scss';

type OwnProps = {
  ref?: RefObject<HTMLButtonElement>;
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: string;
  ariaLabel?: string;
  forFormId?: string;
  kind?: 'transparent';
  isSubmit?: boolean;
  isPrimary?: boolean;
  isSimple?: boolean;
  isText?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isRound?: boolean;
  isSmall?: boolean;
  isDestructive?: boolean;
  onClick?: NoneToVoidFunction;
};

// Longest animation duration
const CLICKED_TIMEOUT = 400;

const LOADING_CLOSE_DURATION = 200;

function Button({
  ref,
  children,
  id,
  className,
  style,
  ariaLabel,
  forFormId,
  kind,
  isSubmit,
  isLoading,
  isPrimary,
  isSimple,
  isText,
  isDisabled,
  isRound,
  isSmall,
  isDestructive,
  onClick,
}: OwnProps) {
  const [isClicked, setIsClicked] = useState(false);

  const {
    shouldRender: shouldRenderLoading,
    hasOpenClass: isLoadingVisible,
  } = useShowTransition(isLoading, undefined, undefined, undefined, undefined, LOADING_CLOSE_DURATION);

  const handleClick = useLastCallback(() => {
    if (!isDisabled && onClick) {
      onClick();
    }

    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, CLICKED_TIMEOUT);
  });

  const loadingClassName = buildClassName(
    isLoading !== undefined && styles.loadingInit,
    isLoading && styles.loadingStart,
  );

  function renderLoading() {
    return (
      <div className={buildClassName(styles.loadingDots, isLoadingVisible && styles.loadingDotsVisible)}>
        <span className={styles.loadingDot} />
        <span className={styles.loadingDot} />
        <span className={styles.loadingDot} />
      </div>
    );
  }

  return (
    <button
      id={id}
      ref={ref}
      type={isSubmit || forFormId ? 'submit' : 'button'}
      className={buildClassName(
        styles.button,
        isSimple && styles.isSimple,
        isSmall && styles.sizeSmall,
        isPrimary && styles.primary,
        (isDisabled || isLoading) && styles.disabled,
        loadingClassName,
        isRound && styles.round,
        isText && styles.isText,
        isDestructive && styles.destructive,
        isClicked && styles.clicked,
        className,
        kind && styles[kind],
      )}
      style={style}
      aria-label={ariaLabel}
      onClick={handleClick}
      disabled={isDisabled || isLoading}
      form={forFormId}
    >
      {children}
      {shouldRenderLoading && renderLoading()}
    </button>
  );
}

export default memo(Button);
