import { Injectable, inject } from '@angular/core';

import { AuthService } from './auth.service';
import { UsuarioService } from './usuario.service';
import { AlunoType, Role } from '../../shared/types/usuario';
import { SIDEBAR_ITEMS } from '../../shared/components/sidebar/sidebar-item.model';
import { VALOR_POR_PLANO } from '../../shared/constants/plano.constants';
import { calcularStatusMensalidade, formatarData } from '../../shared/utils/mensalidade.utils';
import { iniciais, normalizar, tituloCase } from '../../shared/utils/data.utils';

export interface ResultadoBusca {
  titulo: string;
  sub: string;
  /** Texto curto no avatar (iniciais, "R$" ou "→"). */
  avatar: string;
  pagina?: boolean;
  badge?: { texto: string; tom: string };
  rota: string;
  /** Termo que a página de destino usa para já abrir filtrada. */
  filtro?: string;
}

export interface GrupoBusca {
  titulo: string;
  itens: ResultadoBusca[];
}

const TOM_STATUS: Record<string, string> = { Pago: 'green', Pendente: 'amber', Atrasado: 'red' };

const SUB_PAGINA: Record<string, string> = {
  Dashboard: 'Visão geral da academia',
  Recepcionistas: 'Gerenciar contas de recepção',
  Carteira: 'Resumo financeiro e mensalidades',
  Alunos: 'Contas de alunos',
  'Professores e Personais': 'Contas de professores',
  Mensalidades: 'Pendentes e atrasadas',
  Treino: 'Seu plano de treino',
  Pagamentos: 'Suas mensalidades',
  'Meu plano': 'Detalhes da assinatura',
  Configurações: 'Conta, privacidade e notificações',
};

/** Busca global do topo: o que aparece depende do cargo de quem está logado. */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  buscar(termoBruto: string): GrupoBusca[] {
    const usuario = this.authService.usuarioLogado();
    if (!usuario) return [];

    const termo = normalizar(termoBruto.trim());
    const casa = (texto: string) => !termo || normalizar(texto).includes(termo);
    const grupos: GrupoBusca[] = [];
    const role = usuario.role;

    // Dados de outras pessoas: só proprietário e recepção.
    if (role === 'proprietario' || role === 'recepcionista') {
      const alunos = this.usuarioService.listarPorAcademia(usuario.academiaId, 'aluno') as AlunoType[];
      const status = (a: AlunoType) => calcularStatusMensalidade(a.dataDeVencimento);
      const rotaAlunos = '/dashboard/alunos';
      const rotaMensalidades = role === 'proprietario' ? '/dashboard/carteira' : '/dashboard/mensalidades';

      const encontrados = alunos
        .filter((a) => casa(`${a.nome} ${a.email} ${a.plano ?? ''} ${status(a)}`))
        .slice(0, 5)
        .map<ResultadoBusca>((a) => ({
          titulo: a.nome,
          sub: a.plano ? tituloCase(a.plano) : 'Sem plano',
          avatar: iniciais(a.nome),
          badge: { texto: status(a), tom: TOM_STATUS[status(a)] },
          rota: rotaAlunos,
          filtro: a.nome,
        }));
      if (encontrados.length) grupos.push({ titulo: 'Alunos', itens: encontrados });

      if (termo) {
        const pendentes = alunos
          .filter((a) => a.dataDeVencimento && status(a) !== 'Pago' && casa(`${a.nome} ${status(a)} mensalidade`))
          .slice(0, 5)
          .map<ResultadoBusca>((a) => {
            const valor = a.plano ? VALOR_POR_PLANO[a.plano] : 0;
            return {
              titulo: a.nome,
              sub: `Vence em ${formatarData(a.dataDeVencimento)} · ${valor ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Gratuita'}`,
              avatar: 'R$',
              badge: { texto: status(a), tom: TOM_STATUS[status(a)] },
              rota: rotaMensalidades,
              filtro: a.nome,
            };
          });
        if (pendentes.length) grupos.push({ titulo: 'Mensalidades pendentes', itens: pendentes });
      }

      const equipeRole: Role = role === 'proprietario' ? 'recepcionista' : 'professor';
      const equipe = this.usuarioService
        .listarPorAcademia(usuario.academiaId, equipeRole)
        .filter((u) => casa(`${u.nome} ${u.email}`))
        .slice(0, 3)
        .map<ResultadoBusca>((u) => ({
          titulo: u.nome,
          sub: u.email,
          avatar: iniciais(u.nome),
          rota: role === 'proprietario' ? '/dashboard/funcionarios' : '/dashboard/professores',
          filtro: u.nome,
        }));
      if (equipe.length) {
        grupos.push({ titulo: role === 'proprietario' ? 'Recepcionistas' : 'Professores', itens: equipe });
      }
    }

    // Atalhos de páginas (todos os cargos).
    const paginas = [
      { label: 'Dashboard', rota: '/dashboard' },
      ...SIDEBAR_ITEMS.filter((i) => i.roles.includes(role)).map((i) => ({
        label: i.label,
        rota: i.route.startsWith('/') ? i.route : `/dashboard/${i.route}`,
      })),
      { label: 'Configurações', rota: '/dashboard/configuracoes/conta' },
    ]
      .filter((p, i, todas) => todas.findIndex((x) => x.rota === p.rota && x.label === p.label) === i)
      .filter((p) => casa(`${p.label} ${SUB_PAGINA[p.label] ?? ''}`))
      .map<ResultadoBusca>((p) => ({
        titulo: p.label,
        sub: SUB_PAGINA[p.label] ?? 'Ir para a página',
        avatar: '→',
        pagina: true,
        rota: p.rota,
      }));
    if (paginas.length) grupos.push({ titulo: 'Páginas', itens: paginas });

    return grupos;
  }
}
