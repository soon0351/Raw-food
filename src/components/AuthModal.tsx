import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { 
  signUpWithEmail, 
  signInOrAutoSignUp, 
  quickDemoSignIn, 
  getKoreanAuthErrorMessage 
} from '../firebase.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userName: string) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState<string>('스테판');
  const [email, setEmail] = useState<string>('stepan@nature.com');
  const [password, setPassword] = useState<string>('stepan1234');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('stepan1234');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Password length validation (Requirement: 6자 이상)
    if (!password) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage(`비밀번호는 최소 6자 이상이어야 합니다. (현재 ${password.length}자 입력되었습니다.)`);
      return;
    }

    // 2. Sign-up specific validation
    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('성함(또는 닉네임)을 입력해 주세요.');
        return;
      }
      if (password !== passwordConfirm) {
        setErrorMessage('비밀번호와 비밀번호 확인이 서로 다릅니다. 똑같이 입력해 주세요.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const user = await signUpWithEmail(name.trim(), email.trim(), password);
        onAuthSuccess(user.displayName || name.trim() || '스테판');
        onClose();
      } else {
        // Automatic friendly sign-in: if account doesn't exist yet, auto-create it!
        const result = await signInOrAutoSignUp(email.trim(), password, name.trim() || '스테판');
        onAuthSuccess(result.user.displayName || name.trim() || '스테판');
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let friendlyMsg = err.code ? getKoreanAuthErrorMessage(err.code) : '로그인 처리 중 오류가 발생했습니다.';
      
      // If password error or invalid credential
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMsg = '비밀번호가 올바르지 않거나 아직 가입되지 않은 계정입니다. 아래의 "1초 즉시 시작"을 누르시거나 비밀번호를 다시 확인해 주세요.';
      }
      
      setErrorMessage(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  // Instant 1-click login as Stepan
  const handleInstantStepanLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const user = await quickDemoSignIn('스테판');
      onAuthSuccess('스테판');
      onClose();
    } catch (err) {
      console.error('Instant login error:', err);
      // Fallback
      onAuthSuccess('스테판');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FAF7F0] w-full max-w-md rounded-3xl border-2 border-[#DCD3C1] shadow-2xl overflow-hidden my-6 animate-fadeIn">
        
        {/* Modal Top Header */}
        <div className="bg-[#2A4830] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#3D6645] flex items-center justify-center font-black text-sm">
              生
            </span>
            <h3 className="text-xl font-black">
              {mode === 'login' ? '하루한잔 생식 로그인' : '간편 회원가입'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switch between Login & Sign Up */}
        <div className="grid grid-cols-2 p-1.5 bg-[#EDE6D7] border-b border-[#D8CEBD]">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2.5 text-base font-extrabold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#1F3724] shadow-xs'
                : 'text-[#615C52] hover:text-[#2A4830]'
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2.5 text-base font-extrabold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#1F3724] shadow-xs'
                : 'text-[#615C52] hover:text-[#2A4830]'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-4">
          
          {/* Super Easy 1-Click Login Button */}
          <div className="bg-[#E8EFE5] p-3.5 rounded-2xl border-2 border-[#BCD2B9] text-center space-y-2">
            <div className="text-xs font-bold text-[#2A4830]">
              비밀번호 기억하기 번거로우신가요?
            </div>
            <button
              type="button"
              onClick={handleInstantStepanLogin}
              disabled={loading}
              className="w-full py-3 px-4 bg-[#2A4830] hover:bg-[#1E3723] active:scale-98 text-white font-black text-base rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>🌿 "스테판" 님으로 1초 즉시 로그인</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#DFD8CA]"></div>
            <span className="flex-shrink mx-3 text-xs font-bold text-[#8C8474]">또는 이메일 직접 입력</span>
            <div className="flex-grow border-t border-[#DFD8CA]"></div>
          </div>

          {/* Error Message Alert (Highlighted in Friendly Korean) */}
          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 p-3.5 rounded-xl text-sm font-bold flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
              <button
                type="button"
                onClick={handleInstantStepanLogin}
                className="mt-1 text-xs bg-white border border-red-300 text-red-700 py-1.5 px-3 rounded-lg font-extrabold hover:bg-red-50 text-center"
              >
                👉 비밀번호 없이 '스테판' 님으로 바로 로그인하기
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Name Field (Sign-up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-extrabold text-[#322F27] mb-1">
                  이름 (또는 닉네임) *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-[#888172] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="예: 스테판"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:border-[#2A4830] text-base"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-extrabold text-[#322F27] mb-1">
                이메일 주소 *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-[#888172] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="예: stepan@nature.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:border-[#2A4830] text-base"
                />
              </div>
            </div>

            {/* Password Field with Eye Toggle */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-extrabold text-[#322F27]">
                  비밀번호 *
                </label>
                <span className="text-xs text-[#756E61] font-semibold">
                  (최소 6자 이상)
                </span>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-[#888172] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="6자 이상 입력해 주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:border-[#2A4830] text-base font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888172] hover:text-[#2A4830] cursor-pointer"
                  title={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Confirm Field (Sign-up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-extrabold text-[#322F27] mb-1">
                  비밀번호 확인 *
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-[#888172] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="비밀번호를 한 번 더 입력해 주세요"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:border-[#2A4830] text-base font-mono"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-lg font-extrabold text-white bg-[#2A4830] hover:bg-[#1E3723] active:scale-98 rounded-2xl shadow-lg shadow-[#2A4830]/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{mode === 'login' ? '로그인 처리 중...' : '가입 처리 중...'}</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? '로그인하기' : '회원가입 완료'}</span>
                )}
              </button>
            </div>

            {/* Bottom Switch Link */}
            <div className="text-center text-xs sm:text-sm text-[#6C6659] pt-2 border-t border-[#E8E2D5]">
              {mode === 'login' ? (
                <p>
                  아직 회원이 아니신가요?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-[#2A4830] font-black underline ml-1 cursor-pointer"
                  >
                    30초 회원가입
                  </button>
                </p>
              ) : (
                <p>
                  이미 계정이 있으신가요?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-[#2A4830] font-black underline ml-1 cursor-pointer"
                  >
                    로그인하기
                  </button>
                </p>
              )}
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
