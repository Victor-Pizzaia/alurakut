import React from 'react';
import Box from '../src/components/Box';
import MainGrid from '../src/components/MainGrid';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';

function ProfileSideBar({githubUser}) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${githubUser}`}>
          @{githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault/> 
    </Box>
  )
}

function ComunityBox({boxTitle, data }) {
  return (
    <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            {boxTitle} ({data.length})
          </h2> 

          <ul>
            {data.map(item => (
              <li key={item.id}>
                <a href={item.link}>
                  <img src={item.image} />
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const [comunidades, setComuniades] = React.useState([{
    id: '123213213213',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);
  const githubUser = 'Victor-Pizzaia';
  const pessoasFavoritas = [
    {title: 'leoelias023', link: 'https://github.com/leoelias023', image: 'https://github.com/leoelias023.png'},
    {title: 'cod3rcursos', link: 'https://github.com/cod3rcursos', image: 'https://github.com/cod3rcursos.png'},
    {title: 'leonardomleitao', link: 'https://github.com/leonardomleitao', image: 'https://github.com/leonardomleitao.png'},
    {title: 'maykbrito', link: 'https://github.com/maykbrito', image: 'https://github.com/maykbrito.png'},
    {title: 'diego3g', link: 'https://github.com/diego3g', image: 'https://github.com/diego3g.png'},
    {title: 'micaellimedeiros', link: 'https://github.com/micaellimedeiros', image: 'https://github.com/micaellimedeiros.png'},
  ]

  return (
    <>
    <AlurakutMenu githubUser={githubUser}/>
    <MainGrid>
      <div className="profileArea" style={{ gridArea: 'profileArea' }}>
        <ProfileSideBar githubUser={githubUser} />
      </div>
      <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
        <Box>
          <h1 className="title">
            Bem vindo(a)
          </h1>

          <OrkutNostalgicIconSet />

        </Box>
        <Box>
          <h2 className="subTitle">O que você deseja fazer?</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);

            const comunidade = {
              id: new Date().toISOString(),
              title: dadosDoForm.get('title'),
              image: dadosDoForm.get('image'),
            }

            setComuniades(prev => [...prev, comunidade]);
          }}>
            <div>
              <input
                placeholder="Qual vai ser o nome da sua comunidade?"
                name="title"
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
            </div>
            <div>
              <input
                placeholder="Coloque uma URL para usarmos de capa"
                name="image"
                aria-label="Coloque uma URL para usarmos de capa"
              />
            </div>

            <button>
              Criar comunidade
            </button>
          </form>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
        <ComunityBox boxTitle={'Pessoas da comunidade'} data={pessoasFavoritas}/>
        <ComunityBox boxTitle={'Comunidades'} data={comunidades}/>
      </div>
    </MainGrid>
    </>
  )
}
