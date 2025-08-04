//NoteModal
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (note?: string) => void;
  habitName: string;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  habitName
}) => {
  const [note, setNote] = useState('');

  const handleComplete = () => {
    onComplete(note.trim() || undefined);
    setNote('');
  };

  const handleSkip = () => {
    onComplete();
    setNote('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Complete ${habitName}`}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Great job! Add a note about your progress (optional).
        </p>
        
        <Input
          label="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How did it go? Any thoughts?"
          maxLength={200}
        />
        
        <div className="flex space-x-3">
          <Button
            variant="primary"
            onClick={handleComplete}
            className="flex-1"
          >
            Complete
          </Button>
          <Button
            variant="secondary"
            onClick={handleSkip}
            className="flex-1"
          >
            Skip Note
          </Button>
        </div>
      </div>
    </Modal>
  );
};
