import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
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

function ProfileRelationsBox({boxTitle, data }) {
  console.log(data)
  return (
    <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            {boxTitle} ({data.length})
          </h2> 

          <ul>
            {data.map(item => (
              <li key={item.id}>
                <a href={item.html_url}>
                  <img src={item.avatar_url} />
                  <span>{item.login}</span>
                </a>
              </li>
            ))}
          </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const [comunidades, setComuniades] = React.useState([]);
  const [seguidores, setSeguidores] = React.useState([])
  const githubUser = props.githubUser;
  const pessoasFavoritas = [
    {id: 1, login: 'leoelias023', html_url: 'https://github.com/leoelias023', avatar_url: 'https://github.com/leoelias023.png'},
    {id: 2, login: 'cod3rcursos', html_url: 'https://github.com/cod3rcursos', avatar_url: 'https://github.com/cod3rcursos.png'},
    {id: 3, login: 'leonardomleitao', html_url: 'https://github.com/leonardomleitao', avatar_url: 'https://github.com/leonardomleitao.png'},
    {id: 4, login: 'maykbrito', html_url: 'https://github.com/maykbrito', avatar_url: 'https://github.com/maykbrito.png'},
    {id: 5, login: 'diego3g', html_url: 'https://github.com/diego3g', avatar_url: 'https://github.com/diego3g.png'},
    {id: 6, login: 'micaellimedeiros', html_url: 'https://github.com/micaellimedeiros', avatar_url: 'https://github.com/micaellimedeiros.png'},
  ]

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then(resp => resp.json())
      .then(setSeguidores)

    // API do GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '70eaf5327518205c639ef63bd70ad0',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": `query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }`
      })
    })
    .then((resp) => resp.json())
    .then((resp) => {
      setComuniades(resp.data.allCommunities);
    })

  }, [])

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
              title: dadosDoForm.get('title'),
              imageUrl: dadosDoForm.get('image'),
              creatorSlug: githubUser,
            }

            fetch('/api/comunidades', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },

              body: JSON.stringify(comunidade),
            })
            .then(async (resp) => {
              const data = await resp.json();
              setComuniades(prev => [...prev, data.record]);
            })

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
        <ProfileRelationsBox boxTitle={'Seguidores'} data={pessoasFavoritas}/>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Comunidades ({comunidades.length})
          </h2> 

          <ul>
            {comunidades.map(item => (
              <li key={item.id}>
                <a href={`/comunidades/${item.id}`}>
                  <img src={item.imageUrl} />
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBox boxTitle={'Pessoas da comunidade'} data={seguidores}/>
      </div>
    </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token,
    }
  })
  .then((resp) => resp.json())
  
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  if (!githubUser.length) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  return {
    props: {
      githubUser
    },
  }
}
