import SectionHeader from '../components/SectionHeader';

export default function RegistryPage() {
  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background">
      <main className="flex flex-col items-center">
        <div className="casual-font text-xl text-[var(--wedding-secondary-dark)] bg-[#f2f5f3] rounded-2xl shadow-md px-8 py-10 mt-6 w-full max-w-md sm:max-w-lg">
          <SectionHeader label="Registry" />
          <p className="text-center text-sm text-[var(--wedding-secondary-dark)]/70 italic">Coming soon!</p>
        </div>
      </main>
    </div>
  );
}