export default function SectionHeader({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4 my-10 w-full">
        <div className="flex-1 h-px bg-[var(--wedding-secondary-dark)] opacity-20" />
        <div className="flex items-center gap-2 text-[var(--wedding-secondary-dark)] opacity-60">
            <span className="casual-font text-sm tracking-widest uppercase">{label}</span>
        </div>
        <div className="flex-1 h-px bg-[var(--wedding-secondary-dark)] opacity-20" />
        </div>
    );
}