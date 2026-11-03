import React, { useRef, useEffect } from "react";

export default function LoginMfaStep({
  mfaCode,
  setMfaCode,
  onVerify,
  onBack,
  isSubmitting,
  errorMsg,
  styles,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mfaCode.trim() || isSubmitting) return;
    onVerify(mfaCode.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-hm-gold mb-1">
          Verificación en Dos Pasos (2FA)
        </h2>
        <p className="text-xs text-hm-muted">
          Ingrese el código de 6 dígitos o un código de respaldo (formato XXXX-XXXX).
        </p>
      </div>

      <div>
        <label htmlFor="mfa-code-input" className={styles.labels}>
          Código de Verificación
        </label>
        <input
          id="mfa-code-input"
          ref={inputRef}
          className={styles.inputs}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Ej: 123456 o ABCD-1234"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value.toUpperCase())}
          maxLength={9}
          disabled={isSubmitting}
          required
        />
      </div>


      {errorMsg && (
        <div className={styles.errorMessage} role="alert">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        className={styles.btnSubmit}
        disabled={isSubmitting || !mfaCode.trim()}
      >
        {isSubmitting ? "Verificando..." : "Confirmar e Ingresar"}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="text-xs text-hm-muted hover:text-hm-gold transition-colors underline focus:outline-none"
        >
          ← Volver a ingresar correo y contraseña
        </button>
      </div>
    </form>
  );
}
