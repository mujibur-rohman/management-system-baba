function renderRole(role: string) {
  switch (role) {
    case 'supplier':
      return 'Supplier';
    case 'distributor':
      return 'Distributor';
    case 'reseller-up':
      return 'Reseller Up';
    case 'reseller':
      return 'Reseller';
    case 'reseller-nc':
      return 'Non Cash';
    default:
      return '';
  }
}

export default renderRole;
