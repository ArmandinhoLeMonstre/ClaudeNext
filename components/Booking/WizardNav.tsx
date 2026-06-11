type WizardNavProps = {
  showPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function WizardNav({ showPrev, canNext, onPrev, onNext }: WizardNavProps) {
  return (
    <div className="mt-10 border-t border-neutral-800 pt-6">
      <div className="flex items-center justify-between gap-4">
        {showPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-100"
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
          className="bg-white px-6 py-3 font-mono text-xs uppercase tracking-widest text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}