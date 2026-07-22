import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Building2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false || !res.ok) {
        setLoading(false);
        setError(data.message || 'Ocurrió un error');
        return;
      }
      setLoading(false);
      navigate('/sign-in');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="page-shell flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] rounded-md border border-line bg-surface/90 p-6 sm:p-8">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <Building2 className="h-7 w-7 text-accent" />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            PrismaInmobiliaria
          </span>
        </div>

        {/* Título y subtítulo */}
        <h1 className="font-display mb-3 text-center text-4xl font-semibold text-ink">
          Crea tu cuenta
        </h1>
        <p className="mb-10 text-center text-base leading-relaxed text-ink-muted">
          Regístrate gratis y empieza a explorar propiedades en segundos.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Usuario */}
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink-soft">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                id="username"
                placeholder="Tu nombre de usuario"
                onChange={handleChange}
                className="input-field h-[52px] pl-11"
              />
            </div>
          </div>

          {/* Correo electrónico */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-soft">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-ink-muted" />
              <input
                type="email"
                id="email"
                placeholder="tucorreo@ejemplo.com"
                onChange={handleChange}
                className="input-field h-[52px] pl-11"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-soft">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-ink-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Crea una contraseña segura"
                onChange={handleChange}
                className="input-field h-[52px] pr-12 pl-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-md border border-danger/20 bg-danger/5 px-4 py-2.5 text-center text-sm text-danger">
              {error}
            </p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-1 h-[52px] w-full"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        {/* Pie */}
        <p className="mt-7 text-center text-sm text-ink-muted">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/sign-in"
            className="font-semibold text-accent hover:text-accent-dark hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
