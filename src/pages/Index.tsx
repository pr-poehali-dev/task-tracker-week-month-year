import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  tags: string[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
};

type Project = {
  id: string;
  name: string;
  color: string;
  tasksCount: number;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('work');

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Подготовить презентацию для клиента',
      completed: false,
      category: 'work',
      tags: ['urgent', 'presentation'],
      dueDate: '2025-11-14',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Купить продукты',
      completed: false,
      category: 'personal',
      tags: ['shopping'],
      dueDate: '2025-11-14',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Тренировка в зале',
      completed: true,
      category: 'health',
      tags: ['fitness'],
      dueDate: '2025-11-14',
      priority: 'low',
    },
  ]);

  const [projects] = useState<Project[]>([
    { id: '1', name: 'Разработка сайта', color: '#9b87f5', tasksCount: 12 },
    { id: '2', name: 'Маркетинг', color: '#7E69AB', tasksCount: 8 },
    { id: '3', name: 'Личное развитие', color: '#D6BCFA', tasksCount: 5 },
  ]);

  const categories = [
    { value: 'work', label: 'Работа', icon: 'Briefcase' },
    { value: 'personal', label: 'Личное', icon: 'User' },
    { value: 'health', label: 'Здоровье', icon: 'Heart' },
    { value: 'learning', label: 'Обучение', icon: 'GraduationCap' },
  ];

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      category: selectedCategory,
      tags: [],
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
    };
    
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const todayTasks = tasks.filter(task => task.dueDate === '2025-11-14');
  const completedCount = todayTasks.filter(t => t.completed).length;
  const progressPercent = todayTasks.length > 0 ? (completedCount / todayTasks.length) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-card border-r border-border p-6 fixed left-0 top-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="CheckSquare" size={24} className="text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">TaskFlow</h1>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'today', label: 'Сегодня', icon: 'Calendar', count: todayTasks.length },
              { id: 'week', label: 'Неделя', icon: 'CalendarDays', count: 15 },
              { id: 'month', label: 'Месяц', icon: 'CalendarRange', count: 42 },
              { id: 'year', label: 'Год', icon: 'CalendarClock', count: 156 },
              { id: 'projects', label: 'Проекты', icon: 'FolderKanban', count: projects.length },
              { id: 'stats', label: 'Статистика', icon: 'TrendingUp' },
              { id: 'settings', label: 'Настройки', icon: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name={item.icon as any} size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Прогресс дня</span>
              <span className="text-sm font-semibold">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </aside>

        <main className="flex-1 ml-64 p-8">
          {activeTab === 'today' && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Сегодня</h2>
                <p className="text-muted-foreground">Четверг, 14 ноября 2025</p>
              </div>

              <Card className="p-4 mb-6 bg-card/50 backdrop-blur">
                <div className="flex gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <Icon name={cat.icon as any} size={16} />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Добавить новую задачу..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    className="flex-1"
                  />
                  
                  <Button onClick={addTask} size="icon">
                    <Icon name="Plus" size={20} />
                  </Button>
                </div>
              </Card>

              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <Card
                    key={task.id}
                    className={`p-4 transition-all hover:shadow-lg ${
                      task.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <h3 className={`font-medium mb-2 ${task.completed ? 'line-through' : ''}`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority === 'high' && '🔴'}
                            {task.priority === 'medium' && '🟡'}
                            {task.priority === 'low' && '🟢'}
                            {task.priority}
                          </Badge>
                          
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              #{tag}
                            </Badge>
                          ))}
                          
                          <Badge variant="outline" className="ml-auto">
                            <Icon name="FolderOpen" size={14} className="mr-1" />
                            {categories.find(c => c.value === task.category)?.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Проекты</h2>
                <p className="text-muted-foreground">Управление проектами и командами</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="p-6 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: project.color + '40' }}
                      >
                        <Icon
                          name="Folder"
                          size={24}
                          style={{ color: project.color }}
                        />
                      </div>
                      <Button variant="ghost" size="icon">
                        <Icon name="MoreVertical" size={20} />
                      </Button>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="CheckCircle2" size={16} />
                      <span className="text-sm">{project.tasksCount} задач</span>
                    </div>
                  </Card>
                ))}
                
                <Card className="p-6 border-dashed border-2 hover:border-primary transition-colors cursor-pointer flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="Plus" size={32} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Создать проект</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Статистика</h2>
                <p className="text-muted-foreground">Аналитика продуктивности</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Icon name="CheckCircle2" size={24} className="text-primary" />
                    </div>
                    <Badge variant="secondary">+12%</Badge>
                  </div>
                  <p className="text-3xl font-bold mb-1">{completedCount}</p>
                  <p className="text-sm text-muted-foreground">Выполнено сегодня</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} className="text-secondary" />
                    </div>
                    <Badge variant="secondary">85%</Badge>
                  </div>
                  <p className="text-3xl font-bold mb-1">156</p>
                  <p className="text-sm text-muted-foreground">Всего за месяц</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                      <Icon name="Zap" size={24} className="text-accent" />
                    </div>
                    <Badge variant="secondary">7 дней</Badge>
                  </div>
                  <p className="text-3xl font-bold mb-1">12</p>
                  <p className="text-sm text-muted-foreground">Серия выполнения</p>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Активность по категориям</h3>
                <div className="space-y-4">
                  {categories.map((cat, index) => (
                    <div key={cat.value}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon name={cat.icon as any} size={18} />
                          <span className="font-medium">{cat.label}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {[45, 32, 28, 15][index]}%
                        </span>
                      </div>
                      <Progress value={[45, 32, 28, 15][index]} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Настройки</h2>
                <p className="text-muted-foreground">Персонализация трекера</p>
              </div>

              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Icon name="Bell" size={20} />
                    Уведомления
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Напоминания о задачах</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Еженедельный отчёт</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push-уведомления</span>
                      <Checkbox />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Icon name="Palette" size={20} />
                    Внешний вид
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Тёмная тема</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Компактный вид</span>
                      <Checkbox />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Icon name="Target" size={20} />
                    Цели
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Задач в день</label>
                      <Input type="number" defaultValue="5" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Задач в неделю</label>
                      <Input type="number" defaultValue="30" className="mt-1" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
