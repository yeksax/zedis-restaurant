import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white -translate-y-4">
      {/* Hero Section */}
      <div className="relative h-screen">
        <Image
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3"
          alt="Zedis Restaurant Interior"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-serif text-5xl md:text-7xl mb-4">Zedis</h1>
          <p className="text-xl md:text-2xl text-gray-300 italic">Gastronomia Extraordinária</p>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 px-4 md:px-20 bg-black/95">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-12">Nossa História</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            No coração da cidade, o Zedis é um refúgio gastronômico onde cada prato conta uma história única. 
            Nossa cozinha combina técnicas tradicionais com inovação contemporânea, criando experiências 
            culinárias inesquecíveis.
          </p>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-20 px-4 md:px-20">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-16">Menu Degustação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="relative h-[400px] group overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3"
              alt="Prato Principal"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 flex items-end p-6">
              <div>
                <h3 className="font-serif text-2xl mb-2">Pratos Principais</h3>
                <p className="text-gray-300">Experiências gastronômicas únicas</p>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] group overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3"
              alt="Entradas"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 flex items-end p-6">
              <div>
                <h3 className="font-serif text-2xl mb-2">Entradas</h3>
                <p className="text-gray-300">Sabores que despertam os sentidos</p>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] group overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-4.0.3"
              alt="Sobremesas"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 flex items-end p-6">
              <div>
                <h3 className="font-serif text-2xl mb-2">Sobremesas</h3>
                <p className="text-gray-300">O toque final perfeito</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-20 px-4 md:px-20 bg-[#1a1a1a] text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-8">Reserve Sua Experiência</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Permita-nos criar uma noite memorável para você e seus convidados em um ambiente 
          sofisticado e acolhedor.
        </p>
        <Link href="/reservations/new" className="bg-[#8B7355] hover:bg-[#6B563B] text-white px-8 py-3 text-lg transition-colors duration-300">
          Fazer Reserva
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-serif text-xl mb-4">Horário de Funcionamento</h3>
            <p>Terça - Domingo</p>
            <p>19:00 - 23:00</p>
          </div>
          <div>
            <h3 className="font-serif text-xl mb-4">Contato</h3>
            <p>+55 (11) 99999-9999</p>
            <p>contato@zedis.com</p>
          </div>
          <div>
            <h3 className="font-serif text-xl mb-4">Endereço</h3>
            <p>Rua das Flores, 123</p>
            <p>São Paulo - SP</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
