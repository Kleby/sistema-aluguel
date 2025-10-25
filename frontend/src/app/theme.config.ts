export class Themes {
  static DASHBOARD_CARD = {
    ROUPAS: {
      routerLink: '/roupas',
      cardTitle: 'Total Roupas',
      totalStats: (total: number):number | undefined => total ?? '',
      availableStats: (available: number): number | undefined => available ?? '',
      unavailiableStats:(unavailable: number): number | undefined => unavailable ?? '',
      icon: 'fa-tshirt',
      color: 'text-success',
      labels: {
        labelIcon: (condicao: boolean) =>
          condicao ? 'fa-clock-rotate-left' : 'fa-arrow-up',
        label1: (quantity: number) => `${quantity} disponíveis`,
        label2: (quantity: number) => `${quantity} alugadas`,
      },
    },
    ALUGUDAS: {
      routerLink: '/alugueis',
      cardTitle: 'Aluguéis Ativos',
      totalStats: (total: number):number | undefined => total ?? '',
      availableStats: (available: number): number | undefined => available ?? '',
      unavailiableStats:(unavailable: number): number | undefined => unavailable ?? '',
      icon: 'fa-shopping-bag',
      color: 'text-warning',
      labels: {
        labelIcon: (condicao: boolean) =>
          condicao ? 'fa-clock-rotate-left' : 'fa-arrow-up',
        label1: (quantity: number) => `${quantity} atrasados`,
        label2: (quantity: number) => `${quantity} no total`,
      },
    },
    DISPONIVEIS: {
      routerLink: '/manutencao',
      cardTitle: 'Disponíveis',
      totalStats: (total: number):number | undefined => total ?? '',
      availableStats: (available: number): number | undefined => available ?? '',
      unavailiableStats:(unavailable: number): number | undefined => unavailable ?? '',
      icon: 'fa-check-circle',
      color: 'text-danger',
      labels: {
        labelIcon: (condicao: boolean) =>
          condicao ? 'fa-clock-rotate-left' : 'fa-arrow-up',
        label1: (quantity: number) => `${quantity} em manutenção`,
        label2: '',
      },
    },
    CLIENTES: {
      routerLink: '/clientes',
      cardTitle: 'Total de Clientes',
      totalStats: (total: number):number | undefined => total ?? '',
      availableStats: (available: number): number | undefined => available ?? '',
      unavailiableStats:(unavailable: number): number | undefined => unavailable ?? '',
      icon: 'fa-users',
      color: '',
      labels: {
        labelIcon: (condicao: boolean) =>
          condicao ? 'fa-clock-rotate-left' : 'fa-arrow-up',
        label1: (quantity: number) => `${quantity} Clientes cadastrados`,
        label2: '',
      },
    },
  };
}
