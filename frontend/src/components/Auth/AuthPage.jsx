import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Label } from '../ui/label';

const AuthPage = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication - will be replaced with actual backend
    const user = {
      id: '1',
      username: formData.username,
      level: 1,
      experience: 0
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    onAuth(user);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-700">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAzLTRzMyAyIDMgNHYyYzAgMi0yIDQtMyA0cy0zLTItMy00di0yem0wLTMwYzAtMiAyLTQgMy00czMgMiAzIDR2MmMwIDItMiA0LTMgNC0xIDAtMy0yLTMtNFY0ek0wIDM0YzAtMiAyLTQgMy00czMgMiAzIDR2MmMwIDItMiA0LTMgNHMtMy0yLTMtNHYtMnptMC0zMGMwLTIgMi00IDMtNHMzIDIgMyA0djJjMCAyLTIgNC0zIDRzLTMtMi0zLTRWNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <Card className="w-full max-w-md z-10 shadow-2xl border-amber-600">
        <CardHeader className="space-y-2 text-center">
          <div className="text-6xl mb-4">🤠</div>
          <CardTitle className="text-3xl font-bold text-amber-900">Дикий Запад</CardTitle>
          <CardDescription className="text-lg">
            {isLogin ? 'Войдите в игру' : 'Создайте новый аккаунт'}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                name="username"
                placeholder="Введите имя"
                value={formData.username}
                onChange={handleChange}
                required
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Введите email"
                  value={formData.email}
                  onChange={handleChange}
                  required={!isLogin}
                  className="border-amber-300 focus:border-amber-500"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
                required
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-6 text-lg"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
            
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-amber-700 hover:text-amber-900 underline"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthPage;
