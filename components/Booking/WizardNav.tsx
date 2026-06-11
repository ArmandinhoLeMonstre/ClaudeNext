type WizardNavProps = {
  showPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function WizardNav({ showPrev, canNext, onPrev, onNext }: WizardNavProps) {
  return (
    <div className="mt-8 border-t border-border-default pt-6">
      <div className="flex items-center justify-between gap-4">
        {showPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="rounded-card border border-border-default px-6 py-3 font-mono text-[11px] uppercase tracking-label text-foreground transition-colors hover:border-border-hover"
          >
            Précédent
          </button>
        ) : (
          <span /> // spacer keeps Suivant right-aligned when there's no Précédent
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="rounded-card bg-foreground px-[26px] py-[13px] font-mono text-[11px] uppercase tracking-label text-inverse transition-colors disabled:cursor-not-allowed disabled:bg-elevated disabled:text-border-hover"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}