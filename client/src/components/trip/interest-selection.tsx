import { DEFAULT_INTERESTS } from "@/lib/types";

interface InterestSelectionProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
}

export default function InterestSelection({ selectedInterests, onChange }: InterestSelectionProps) {
  const toggleInterest = (name: string) => {
    if (selectedInterests.includes(name)) {
      onChange(selectedInterests.filter(interest => interest !== name));
    } else {
      onChange([...selectedInterests, name]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {DEFAULT_INTERESTS.map(interest => (
        <button
          key={interest.id}
          type="button"
          className={`px-3 py-1.5 text-sm font-medium rounded-full 
            ${selectedInterests.includes(interest.name) 
              ? 'bg-primary/20 text-primary' 
              : 'bg-muted hover:bg-primary/10 hover:text-primary transition-colors'
            }`}
          onClick={() => toggleInterest(interest.name)}
        >
          <i className={`fas fa-${interest.icon} mr-1.5`}></i>
          {interest.name}
        </button>
      ))}
    </div>
  );
}
