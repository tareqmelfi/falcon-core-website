import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const PartnersCarousel = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [pausedAnimation, setPausedAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const partners = [
    // AI Models - Most Important
    { name: 'Claude', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F1595b4b1f1bf4576b7a3e4cbdfef4d37?format=webp&width=800' },
    { name: 'ChatGPT', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F33fa1fa2ce794f0a868208e462d119c1?format=webp&width=800' },
    { name: 'Google Gemini', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F8782f6eaf4cb4aec937e49fbcf9fab58?format=webp&width=800' },
    { name: 'Anthropic', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F1a34997b534642c1859366010d0b9c43?format=webp&width=800' },
    { name: 'DeepSeek', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F2faccadf482f4558a0c36aa7079d8506?format=webp&width=800' },
    { name: 'Grok', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F1d0156aa46d546139ebe1d0b3c79bfb4?format=webp&width=800' },
    { name: 'Perplexity', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F37b47aeb70c64adca86e77b97260aa27?format=webp&width=800' },
    { name: 'Hugging Face', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F0745a46f983043c6901cf5f7cd0245c9?format=webp&width=800' },

    // Development & Deployment
    { name: 'Builder.io', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F5f9855d57c6e4489bd0cd9647786bbe3?format=webp&width=800' },
    { name: 'Vercel v0', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fb9305cbad05b4e7e8794996b8484b62f?format=webp&width=800' },
    { name: 'Figma', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F33098710f0c74e48822887b2cadf0e64?format=webp&width=800' },
    { name: 'Framer', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Ff4947ad9f0f04563bebca3fd991f4827?format=webp&width=800' },
    { name: 'Webflow', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F0ee2915b894b4732be5353d6feb41413?format=webp&width=800' },
    { name: 'WordPress', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F456b517e62a940619d87858951436f18?format=webp&width=800' },
    { name: 'Elementor', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F9e2623ba441649f68021185b588de64e?format=webp&width=800' },

    // Infrastructure & Cloud
    { name: 'AWS', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fe590fdd088504b45bf92df32b5965e67?format=webp&width=800' },
    { name: 'Cloudflare', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F25d64da84bbc45c6b56a353f4cfee5c1?format=webp&width=800' },
    { name: 'Hetzner', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F4c09e5ec0ff4432d83ea66aa6c87ec66?format=webp&width=800' },
    { name: 'Supabase', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F74eeccf3fa124d66aaec59629d092020?format=webp&width=800' },

    // Image & Video Generation
    { name: 'Sora', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F5fcf545426994719b7b0261ea83e160e?format=webp&width=800' },
    { name: 'Runway', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fe0e92e7887b04cd68382789db3de4c40?format=webp&width=800' },
    { name: 'Black Forest Labs', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F35df4567911f4d9f8dcf123a9b380c4d?format=webp&width=800' },
    { name: 'Fal AI', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Ffb4180cf17bd43f78e54192f34229c3a?format=webp&width=800' },
    { name: 'Krea AI', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F1df40fb11b684aa5a881242d722e6d92?format=webp&width=800' },

    // Audio & Video AI
    { name: 'HeyGen', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fc01d8c88831146c4aa25670891c2ea23?format=webp&width=800' },
    { name: 'Synthesia', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F87bfa82ca6e8476cbe0f8d7df21d2fff?format=webp&width=800' },
    { name: 'ElevenLabs', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F5da82080fa4742aa8a19051d0b83a73b?format=webp&width=800' },
    { name: 'Suno', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Ff235f8958458442691857d799dc72200?format=webp&width=800' },

    // Automation & Workflow
    { name: 'n8n', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Faf2a87847b0b4bcab8404382a412a40a?format=webp&width=800' },

    // Productivity & Collaboration
    { name: 'Notion', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F1fd6a866c5dc4aef9d773b01ee0e7f8c?format=webp&width=800' },
    { name: 'Miro', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Ffbfa409663514d1cb1e25f159247b62d?format=webp&width=800' },
    { name: 'Monday.com', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F05df87ed85584b0f97ef3d644b9fec46?format=webp&width=800' },

    // Other AI & Tools
    { name: 'OpenRouter', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F7117a531ef934ccdad4a50cf86d4f4d1?format=webp&width=800' },
    { name: 'Ollama', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fd6989a5c28804761bac6eb7fb6898220?format=webp&width=800' },
    { name: 'Gamma AI', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Ff0441bc26cc44fe0a8366b128c0ef3a0?format=webp&width=800' },
    { name: 'Lovable', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F4be652cafac24d8a8eca07112ee5a4e0?format=webp&width=800' },
    { name: 'Replit', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F609f29cc4b744269b592a4761ef1a417?format=webp&width=800' },
    { name: 'DeepMind', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fc3fa6df4058b45d28285528a27f54907?format=webp&width=800' },
    { name: 'Google AI Studio', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fbe9da4395b354b62839d6eaa13eff73f?format=webp&width=800' },
    { name: 'Google Firebase', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fbcb8e430404e4787887321266574cd26?format=webp&width=800' },
    { name: 'Flutter', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F9167563ed15e4430ac8cf24a68077caa?format=webp&width=800' },
    { name: 'Coolify', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F55fa78b07253407696d873aef768de06?format=webp&width=800' },
    { name: 'Dokploy', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F9fb590ca32794277957df858a6f3c576?format=webp&width=800' },
    { name: 'PocketBase', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fb7585667b76540eca119c8fb8dc40193?format=webp&width=800' },
    { name: 'ComfyUI', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F48415cc79b084ce2b9406bb4d0931d4d?format=webp&width=800' },
    { name: 'Manus AI', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Ff1b53d856adc45faa106020d9775905f?format=webp&width=800' },
    { name: 'Fathom', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F2cee75003b42416f84a3cfbbddd6a883?format=webp&width=800' },
    { name: 'Adobe', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fe5c602bfff4a434292c657b977c1ffa7?format=webp&width=800' },
    { name: 'Google', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F6e0237f685ee493693911c7735b1860f?format=webp&width=800' },
    { name: 'Google Opal', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F7931bd4986ce486e859c9b968d973b10?format=webp&width=800' },
    { name: 'Google Antigravity', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F142f6c9b56ee4cb9a3e1bafbcc36cb2e?format=webp&width=800' },
    { name: 'Go', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fe2dd671c47724d31bbe80f9fc22e0f64?format=webp&width=800' },
    { name: 'LM Studio', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fde3cdcd926a34f68855ee24ab07e4b5d?format=webp&width=800' },
    { name: 'Porkbun', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F1d5ce01579d042c28e9a0c30bea8c751?format=webp&width=800' },
    { name: 'Solutions by STC', logo: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Ff2e654615216441d87e3f3990edbb76b?format=webp&width=800' },
  ];

  const rowsData = [
    partners.slice(0, 9),
    partners.slice(9, 18),
    partners.slice(18, 27),
    partners.slice(27),
  ];

  const handleMouseDown = () => {
    setIsDragging(true);
    setPausedAnimation(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Lighter background with gradient reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-primary/5 backdrop-blur-md" />
      
      <div className="container mx-auto px-4 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-center text-muted-foreground text-sm font-medium uppercase tracking-wider">
            Trusted Partners & Integrations
          </p>
          <p className="text-center text-foreground/60 text-base mt-2">
            Powering innovation with leading technologies and platforms
          </p>
        </motion.div>
      </div>

      <div
        ref={containerRef}
        className="relative z-10 space-y-6 cursor-grab active:cursor-grabbing px-4"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {rowsData.map((row, rowIndex) => (
          <motion.div
            key={rowIndex}
            animate={pausedAnimation ? { x: dragX } : { x: ['0%', '-50%'] }}
            transition={pausedAnimation ? { type: 'spring', stiffness: 300, damping: 30 } : { duration: 200, repeat: Infinity, ease: 'easeInOut' }}
            drag={pausedAnimation ? 'x' : false}
            dragElastic={0.2}
            onDrag={(_, info) => {
              setDragX(info.offset.x);
            }}
            onDragEnd={handleDragEnd}
            className="flex gap-4 w-fit"
          >
            {[...row, ...row].map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: (index % row.length) * 0.05,
                  ease: 'easeOut'
                }}
                whileHover={{ scale: 1.08, y: -4 }}
                className="flex-shrink-0 h-20 w-40 flex items-center justify-center group relative"
              >
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  whileHover={{ scale: 1.2 }}
                />
                
                {/* Logo Container */}
                <div className="h-full w-full flex items-center justify-center px-3 py-2 rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors duration-300 backdrop-blur-sm bg-white/5 group-hover:bg-white/10">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-16 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 select-none"
                    loading="lazy"
                    draggable="false"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      {pausedAnimation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-xs text-muted-foreground bg-background/80 backdrop-blur px-3 py-1 rounded-full border border-white/10"
        >
          Drag to scroll • Click to resume
        </motion.div>
      )}
    </section>
  );
};

export default PartnersCarousel;
