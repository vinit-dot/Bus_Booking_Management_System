import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Select Seats' },
  { id: 2, label: 'Passenger Details' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirmation' },
];

export default function BookingSteps({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all
              ${step.id < current ? 'bg-green-500 text-white' :
                step.id === current ? 'bg-primary-600 text-white ring-4 ring-primary-100' :
                'bg-gray-200 text-gray-500'}`}>
              {step.id < current ? <Check size={16} /> : step.id}
            </div>
            <span className={`text-xs mt-1 font-medium whitespace-nowrap
              ${step.id === current ? 'text-primary-600' : step.id < current ? 'text-green-600' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-16 sm:w-24 h-0.5 mx-1 mb-4 transition-all ${step.id < current ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
