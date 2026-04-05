export function validateSignupForm(
  formData: any,
  formValidation: any,
  setErrors: any,
) {
  const newErrors: any = {};

  if (!formData.fullName.trim()) {
    newErrors.fullName = formValidation.fullNameRequired;
  } else if (formData.fullName.trim().length < 2) {
    newErrors.fullName = formValidation.fullNameTooShort;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    newErrors.email = formValidation.emailRequired;
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = formValidation.emailInvalid;
  }

  if (!formData.password) {
    newErrors.password = formValidation.passwordRequired;
  } else if (formData.password.length < 8) {
    newErrors.password = formValidation.passwordTooShort;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    newErrors.password = formValidation.passwordWeak;
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = formValidation.confirmPasswordRequired;
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = formValidation.passwordsNotMatch;
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}
