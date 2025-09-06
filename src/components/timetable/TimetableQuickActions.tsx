'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, BookOpen, Loader2 } from 'lucide-react';
import { TimetableExporter } from '../TimetableExporter';
import { AddEntryForm } from './AddEntryForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TimetableEntry {
  id: string;
  subjectName: string;
  teacherName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

interface TimetableQuickActionsProps {
  onAddEntry?: (entry: Omit<TimetableEntry, 'id'>) => void;
  onRegenerate?: () => void;
  tableId: string;
  className?: string;
}

export const TimetableQuickActions = ({
  onAddEntry,
  onRegenerate,
  tableId,
  className = '',
}: TimetableQuickActionsProps) => {
  const handleAddEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    if (onAddEntry) {
      onAddEntry(entry);
    } else {
      console.log('Adding entry:', entry);
      // If no handler is provided, just log the entry
    }
  };

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleRegenerate = async () => {
    setShowConfirmDialog(true);
  };

  const confirmRegenerate = async () => {
    setShowConfirmDialog(false);
    setIsRegenerating(true);
    try {
      if (onRegenerate) {
        await onRegenerate();
      }
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <AddEntryForm 
        onAddEntry={handleAddEntry}
        className="w-full justify-start"
      />
      
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={handleRegenerate}
      >
        {isRegenerating ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-2" />
        )}
        {isRegenerating ? 'Regenerating...' : 'Regenerate Timetable'}
      </Button>
      
      <TimetableExporter 
        tableId={tableId}
        className="w-full justify-start"
      />
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all manual entries and regenerate the timetable. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRegenerate}>
              {isRegenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                'Regenerate'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
