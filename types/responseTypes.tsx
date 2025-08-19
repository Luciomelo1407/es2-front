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
