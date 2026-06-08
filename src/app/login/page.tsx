import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


export default function LoginPage() {

    
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
          <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            
            {/* Espaço para a sua Logo de image_4a9406.png */}
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="relative h-16 w-16 mb-2">
                {/* Adicione a imagem na sua pasta /public quando puder */}
                <div className="font-bold text-2xl text-primary flex items-center justify-center h-full w-full border-2 border-dashed border-zinc-300 rounded-lg">
                  DI
                </div>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                NetManager
              </h1>
              <p className="text-xs text-muted-foreground">
                Gestão de Ativos e Infraestrutura de Rede
              </p>
            </div>
    
           
    
            <form  className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">E-mail</label>
                <Input
                  type="email"
                  placeholder="admin@empresa.com"
                  
                                    className="focus-visible:ring-primary"
                />
                
              </div>
    
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Senha</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  
                  className="focus-visible:ring-primary"
                />
               
              </div>
    
              {/* O botão abaixo usará o Azul Escuro (--primary) que configuramos da logo! */}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium" >
              
              </Button>
            </form>
          </div>
        </div>
    )














    
}