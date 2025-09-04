export type IProfissional = {
  id: number; // Considere padronizar para number se for o caso na sua API
  nomeCompleto: string;
  coren: string;
  cbo: string;
  email: string;
  dataNascimento: string;
  cpf: string;
  isAdmin: boolean;
  enderecoId: string;
  ubsId: string;
};

export type AccessToken = {
  type: string;
  name: string | null;
  token: string;
  abilities: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
};

export type ISala = {
  id: number;
  tamanho: number | null;
  acessibilidade: boolean;
  paredeLavavel: boolean;
  pisoLavavel: boolean;
  portaLavavel: boolean;
  janelaLavavel: boolean;
  tetoLavavel: boolean;
  pja: boolean;
};

export type Iestoque = {
  id: number;
  salaId: number;
  tipo: string;
  vacinaEstoque: IVacinaEstoque[] | null;
};

export type IVacinaEstoque = {
  id: number;
  vacinaId: number;
  estoqueId: number;
  quantidade: number;
  validade: string;
  vacinaLote: IVacinaLote | null;
};

export type ITemperaturas = {
  estoqueId: number;
  profissionalId: number;
  id: number;
  temperatura: number;
};

export type IdiaTrabalho = {
  id: number;
  salaId: number;
  profissionalId: number;
};

export type IVacinaLote = {
  id: number;
  codLote: string;
  validade: string;
  sigla: string;
  nome: string;
  tipo: string;
  fabricante: string;
  doses: number;
};
