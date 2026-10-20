(function () {
  const WEDDING_DATE = '2027-04-25';
  const apiBase = () => String(window.CONTRIBUTIONS_API_BASE || '').replace(/\/$/, '');
  const digits = (value) => String(value || '').replace(/\D/g, '');
  function ageOnWedding(birthDate) {
    const birth = new Date(`${birthDate}T12:00:00`);
    const event = new Date(`${WEDDING_DATE}T12:00:00`);
    let age = event.getFullYear() - birth.getFullYear();
    if (event.getMonth() < birth.getMonth() || (event.getMonth() === birth.getMonth() && event.getDate() < birth.getDate())) age--;
    return age;
  }
  window.submitWeddingRSVP = async function (input) {
    const fullName = String(input.full_name || '').trim().replace(/\s+/g, ' ');
    const phone = digits(input.phone);
    const personType = input.person_type === 'child' ? 'child' : 'adult';
    if (fullName.split(' ').length < 2) throw new Error('Informe o nome completo da pessoa confirmada.');
    if (phone.length < 10 || phone.length > 13) throw new Error('Informe um telefone válido para confirmar a identidade.');
    if (!input.identity_confirmed) throw new Error('Confirme que os dados pertencem somente à pessoa informada.');
    if (personType === 'child') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(input.birth_date || '') || ageOnWedding(input.birth_date) < 0 || ageOnWedding(input.birth_date) > 9) {
        throw new Error('A confirmação de criança exige data de nascimento e aceita somente até 9 anos na data do casamento.');
      }
    }
    const base = apiBase();
    if (!base) throw new Error('O serviço de confirmação ainda não está disponível.');
    const response = await fetch(`${base}/v1/rsvps`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, phone, email: String(input.email || '').trim(), person_type: personType, birth_date: personType === 'child' ? input.birth_date : null, identity_confirmed: true, notes: String(input.notes || '').trim() })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || 'Não foi possível registrar a confirmação.');
    return body;
  };
})();