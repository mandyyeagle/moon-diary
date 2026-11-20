import { motion } from 'framer-motion';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'today', label: 'Сегодня' }, // Первая вкладка
    { id: 'lunnik', label: 'Муун' },
    { id: 'calendar', label: 'Календарь' },
  ];

  return (
    <div className="flex justify-between items-center w-full px-6 pt-6 pb-0 relative z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative px-4 py-2 flex items-center justify-center transition-colors duration-500 ease-in-out ${
            activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="relative z-10 text-[13px] uppercase tracking-wider font-medium whitespace-nowrap">
            {tab.label}
          </span>

          {activeTab === tab.id && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 0 15px rgba(100, 150, 255, 0.2)',
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 25, mass: 1 }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  padding: '1px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
            </motion.div>
          )}
        </button>
      ))}
    </div>
  );
}