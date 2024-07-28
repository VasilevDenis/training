import React, { useState } from 'react';
import './App.css';

interface Workout {
  date: string;
  kilometers: number;
}

const App: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [date, setDate] = useState('');
  const [kilometers, setKilometers] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const existingWorkoutIndex = workouts.findIndex((workout) => workout.date === date);
    if (existingWorkoutIndex >= 0) {
      const updatedWorkouts = [...workouts];
      updatedWorkouts[existingWorkoutIndex].kilometers += kilometers;
      setWorkouts(updatedWorkouts);
    } else {
      setWorkouts([...workouts, { date, kilometers }]);
    }
    
    // Sort workouts by date
    setWorkouts((prevWorkouts) =>
      [...prevWorkouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    // Clear input fields
    setDate('');
    setKilometers(0);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updatedWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(updatedWorkouts);
  };

  const handleEdit = (index: number) => {
    setDate(workouts[index].date);
    setKilometers(workouts[index].kilometers);
    setEditingIndex(index);
  };

  return (
    <div className="App">
      <form onSubmit={handleAddOrUpdate}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="number"
          value={kilometers}
          onChange={(e) => setKilometers(Number(e.target.value))}
          placeholder="Километры"
          required
        />
        <button type="submit">{editingIndex !== null ? 'Обновить' : 'Добавить'}</button>
      </form>
      <WorkoutTable workouts={workouts} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

interface WorkoutTableProps {
  workouts: Workout[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const WorkoutTable: React.FC<WorkoutTableProps> = ({ workouts, onEdit, onDelete }) => {
  return (
    <div className="workout-table">
      <div className="workout-table-header">
        <div className="workout-table-cell">Дата</div>
        <div className="workout-table-cell">Километры</div>
        <div className="workout-table-cell">Действия</div>
      </div>
      {workouts.map((workout, index) => (
        <div className="workout-table-row" key={index}>
          <div className="workout-table-cell">{workout.date}</div>
          <div className="workout-table-cell">{workout.kilometers}</div>
          <div className="workout-table-cell">
            <button onClick={() => onEdit(index)}>✎</button>
            <button onClick={() => onDelete(index)}>✘</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
