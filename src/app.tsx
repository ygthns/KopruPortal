import { useLocation, useRoutes } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { appRoutes } from '@/routes';

export default function App() {
  const element = useRoutes(appRoutes);
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2 }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
}
