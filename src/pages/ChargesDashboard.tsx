import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Plus, Trash2, Edit, Waves, CreditCard, QrCode, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChargeForm { id?: string; atividade_servico: string; nome_aluno: string; numero_aluno: string; valor: string; data_vencimento: string; data_emissao: string; }
interface ChargeRow { id: string; atividade_servico: string; nome_aluno: string; numero_aluno: string; valor: string; data_vencimento: string; data_emissao: string; link_pagamento_stripe: string | null; pix_qrcode_url: string | null; pix_copia_cola: string | null; gateway_transacao_id: string | null; }

const toCurrency = (valor: string | number) => {
  const num = typeof valor === 'number' ? valor : parseFloat(valor);
  return (isNaN(num)?0:num).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
const todayISO = () => new Date().toISOString().substring(0,10);

const ChargesDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [charges, setCharges] = useState<ChargeRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ChargeForm>({ atividade_servico: '', nome_aluno: '', numero_aluno: '', valor: '', data_vencimento: todayISO(), data_emissao: todayISO() });
  const [tableMissing, setTableMissing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }}) => { setSession(session); if (!session) navigate('/auth'); else ensureInstructorAndLoadCharges(); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, sess) => { setSession(sess); if (!sess) navigate('/auth'); else ensureInstructorAndLoadCharges(); });
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ensureInstructorAndLoadCharges = async () => {
    // Garantir que existe registro em instrutores_webapp
    const { data: instructor } = await supabase
      .from('instrutores_webapp')
      .select('id')
      .eq('id', session?.user?.id || '')
      .single();

    if (!instructor && session?.user) {
      // Criar registro do instrutor se não existir
      await supabase.from('instrutores_webapp').upsert({
        id: session.user.id,
        nome_completo: session.user.user_metadata?.nome || 'Nome não informado',
        email: session.user.email || '',
        celular: session.user.user_metadata?.contato || '(00) 00000-0000',
        senha_hash: 'managed_by_supabase_auth'
      });
    }
    
    loadCharges();
  };

  const loadCharges = async () => {
    setLoading(true);
  const { data, error } = await supabase.from('cobrancas').select('*').order('data_vencimento', { ascending: true });
    if (error) {
      if (/does not exist|not found|relationship|schema/i.test(error.message)) {
        setTableMissing(true);
      }
      toast({ title: 'Erro', description: 'Falha ao carregar cobranças', variant: 'destructive' });
    } else {
      setTableMissing(false);
      setCharges(data as any);
    }
    setLoading(false);
  };

  const resetForm = () => { setForm({ atividade_servico: '', nome_aluno: '', numero_aluno: '', valor: '', data_vencimento: todayISO(), data_emissao: todayISO() }); setEditing(false); };

  const handleCreateOrUpdate = async () => {
    if (!form.atividade_servico || !form.nome_aluno || !form.numero_aluno || !form.valor || !form.data_vencimento) { toast({ title: 'Campos obrigatórios', description: 'Preencha serviço, aluno, telefone, valor e vencimento', variant: 'destructive' }); return; }
    const valorNumber = parseFloat(form.valor.replace(/\./g,'').replace(',','.'));
    if (!valorNumber || valorNumber <= 0) { toast({ title: 'Valor inválido', description: 'Informe um valor maior que zero', variant: 'destructive' }); return; }
    setLoading(true);
    if (editing && form.id) {
      const { error } = await supabase.from('cobrancas').update({ atividade_servico: form.atividade_servico, nome_aluno: form.nome_aluno, numero_aluno: form.numero_aluno, valor: valorNumber.toFixed(2), data_vencimento: form.data_vencimento, data_emissao: form.data_emissao }).eq('id', form.id);
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' }); else toast({ title: 'Cobrança atualizada' });
    } else {
      const { error } = await supabase.from('cobrancas').insert({ instrutor_id: session?.user.id, atividade_servico: form.atividade_servico, nome_aluno: form.nome_aluno, numero_aluno: form.numero_aluno, valor: valorNumber.toFixed(2), data_vencimento: form.data_vencimento, data_emissao: form.data_emissao });
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' }); else toast({ title: 'Cobrança criada' });
    }
    setLoading(false); setShowForm(false); resetForm(); loadCharges();
  };
  const handleEdit = (c: ChargeRow) => { setForm({ id: c.id, atividade_servico: c.atividade_servico, nome_aluno: c.nome_aluno, numero_aluno: c.numero_aluno, valor: parseFloat(c.valor).toFixed(2).replace('.',','), data_vencimento: c.data_vencimento.substring(0,10), data_emissao: c.data_emissao.substring(0,10) }); setEditing(true); setShowForm(true); };
  const handleDelete = async (id: string) => { if (!confirm('Remover cobrança?')) return; const { error } = await supabase.from('cobrancas').delete().eq('id', id); if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' }); else toast({ title: 'Removida' }); loadCharges(); };

  const triggerStripe = async (c: ChargeRow) => { try { setLoading(true); const amountCents = Math.round(parseFloat(c.valor) * 100); const { data, error } = await supabase.functions.invoke('create-payment', { body: { amount: amountCents, currency: 'brl', description: `${c.atividade_servico} - ${c.nome_aluno}`, student_name: c.nome_aluno, student_email: '', instructor_name: session?.user.user_metadata?.nome || '', activity: c.atividade_servico, payment_amount: parseFloat(c.valor), due_date: c.data_vencimento } }); if (error) throw error; if (data?.url) { window.open(data.url, '_blank'); await supabase.from('cobrancas').update({ link_pagamento_stripe: data.url, gateway_transacao_id: data.session_id }).eq('id', c.id); toast({ title: 'Link gerado' }); loadCharges(); } } catch (e: any) { toast({ title: 'Erro', description: e.message, variant: 'destructive' }); } finally { setLoading(false); } };
  const triggerPix = async (c: ChargeRow) => { try { setLoading(true); const amountCents = Math.round(parseFloat(c.valor) * 100); const { data, error } = await supabase.functions.invoke('create-pix-payment', { body: { amount: amountCents, description: `${c.atividade_servico} - ${c.nome_aluno}`, student_name: c.nome_aluno, student_email: '', instructor_name: session?.user.user_metadata?.nome || '', activity: c.atividade_servico, payment_amount: parseFloat(c.valor), due_date: c.data_vencimento } }); if (error) throw error; if (data?.success) { await supabase.from('cobrancas').update({ pix_copia_cola: data.pix_code, pix_qrcode_url: data.payment_url, gateway_transacao_id: data.payment_id }).eq('id', c.id); if (data.payment_url) window.open(data.payment_url, '_blank'); toast({ title: 'PIX gerado' }); loadCharges(); } } catch (e: any) { toast({ title: 'Erro', description: e.message, variant: 'destructive' }); } finally { setLoading(false); } };

  const filtered = useMemo(() => { const term = search.toLowerCase(); return charges.filter(c => [c.atividade_servico, c.nome_aluno, c.numero_aluno].some(v => v.toLowerCase().includes(term))); }, [charges, search]);
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/auth'); };

  return <div className="min-h-screen bg-background"><div className="border-b bg-card/50 backdrop-blur"><div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between"><div className="flex items-center gap-3"><Waves className="h-8 w-8 text-primary" /><div><h1 className="text-2xl font-bold">Cobranças</h1><p className="text-sm text-muted-foreground">Controle simples de cobranças</p></div></div><div className="flex gap-2"><Input placeholder="Buscar" value={search} onChange={e=>setSearch(e.target.value)} className="w-48" /><Dialog open={showForm} onOpenChange={(o)=> {setShowForm(o); if(!o) { resetForm(); }}}><DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Nova</Button></DialogTrigger><DialogContent className="max-w-md"><DialogHeader><DialogTitle>{editing? 'Editar Cobrança' : 'Nova Cobrança'}</DialogTitle><DialogDescription>Preencha os dados essenciais</DialogDescription></DialogHeader><div className="space-y-4"><div className="space-y-2"><Label>Serviço *</Label><Input value={form.atividade_servico} onChange={e=>setForm({...form, atividade_servico: e.target.value})} placeholder="Aula de Surf" /></div><div className="space-y-2"><Label>Aluno *</Label><Input value={form.nome_aluno} onChange={e=>setForm({...form, nome_aluno: e.target.value})} placeholder="Nome do aluno" /></div><div className="space-y-2"><Label>Telefone *</Label><Input value={form.numero_aluno} onChange={e=>setForm({...form, numero_aluno: e.target.value})} placeholder="(11) 99999-9999" /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Valor (R$) *</Label><Input value={form.valor} onChange={e=>setForm({...form, valor: e.target.value})} placeholder="100,00" /></div><div className="space-y-2"><Label>Vencimento *</Label><Input type="date" value={form.data_vencimento} onChange={e=>setForm({...form, data_vencimento: e.target.value})} /></div></div><div className="space-y-2"><Label>Emissão</Label><Input type="date" value={form.data_emissao} onChange={e=>setForm({...form, data_emissao: e.target.value})} /></div><Button onClick={handleCreateOrUpdate} disabled={loading} className="w-full">{loading? 'Salvando...' : (editing? 'Salvar Alterações' : 'Criar Cobrança')}</Button></div></DialogContent></Dialog><Button variant="outline" onClick={handleLogout}> <LogOut className="h-4 w-4 mr-1" /> Sair</Button></div></div></div><div className="max-w-6xl mx-auto p-6 space-y-6"><Card><CardHeader><CardTitle>Resumo</CardTitle><CardDescription>Visão geral das cobranças</CardDescription></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4"><div><div className="text-sm text-muted-foreground">Total</div><div className="text-2xl font-bold">{charges.length}</div></div><div><div className="text-sm text-muted-foreground">Valor Total</div><div className="text-2xl font-bold">{toCurrency(charges.reduce((s,c)=> s + (parseFloat(c.valor)||0),0))}</div></div><div><div className="text-sm text-muted-foreground">Próx. Vencimento</div><div className="text-2xl font-bold">{charges.length? new Date(charges[0].data_vencimento).toLocaleDateString('pt-BR'): '-'}</div></div><div><div className="text-sm text-muted-foreground">Com PIX/Stripe</div><div className="text-2xl font-bold">{charges.filter(c=> c.pix_qrcode_url || c.link_pagamento_stripe).length}</div></div></CardContent></Card><Card><CardHeader><CardTitle>Lista de Cobranças ({filtered.length})</CardTitle><CardDescription>Gerencie e gere links/PIX</CardDescription></CardHeader><CardContent>{tableMissing ? <div className="py-8 space-y-4"><p className="text-sm text-red-600 font-medium">A tabela 'cobrancas' não foi encontrada.</p><ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground"><li>Acesse Supabase Studio &gt; SQL Editor.</li><li>Execute a migration de billing mais recente em <code className="bg-muted px-1 rounded">supabase/migrations</code>.</li><li>Ou rode o CLI: <code className="bg-muted px-1 rounded">supabase db push</code>.</li><li>Clique em Re-tentar.</li></ol><Button variant="outline" onClick={loadCharges} disabled={loading}>Re-tentar</Button></div> : (filtered.length === 0 ? <div className="text-center py-10 text-muted-foreground">Nenhuma cobrança</div> : <Table><TableHeader><TableRow><TableHead>Serviço</TableHead><TableHead>Aluno</TableHead><TableHead>Telefone</TableHead><TableHead>Valor</TableHead><TableHead>Emissão</TableHead><TableHead>Vencimento</TableHead><TableHead>Pagamentos</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader><TableBody>{filtered.map(c => <TableRow key={c.id}><TableCell className="font-medium">{c.atividade_servico}</TableCell><TableCell>{c.nome_aluno}</TableCell><TableCell>{c.numero_aluno}</TableCell><TableCell>{toCurrency(c.valor)}</TableCell><TableCell>{new Date(c.data_emissao).toLocaleDateString('pt-BR')}</TableCell><TableCell>{new Date(c.data_vencimento).toLocaleDateString('pt-BR')}</TableCell><TableCell className="text-xs space-y-1"><div>{c.link_pagamento_stripe? 'Stripe' : '-'}</div><div>{c.pix_qrcode_url? 'PIX' : '-'}</div></TableCell><TableCell><div className="flex gap-2 flex-wrap"><Button size="sm" variant="outline" onClick={()=>triggerStripe(c)} disabled={loading}><CreditCard className="h-3 w-3 mr-1" />Cartão</Button><Button size="sm" variant="outline" onClick={()=>triggerPix(c)} disabled={loading}><QrCode className="h-3 w-3 mr-1" />PIX</Button><Button size="sm" variant="outline" onClick={()=>handleEdit(c)}><Edit className="h-3 w-3" /></Button><Button size="sm" variant="destructive" onClick={()=>handleDelete(c.id)}><Trash2 className="h-3 w-3" /></Button></div></TableCell></TableRow>)}</TableBody></Table>)}</CardContent></Card></div></div>;
};

export default ChargesDashboard;
