import { Link } from 'react-router-dom';

// Apollo Client
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_ID_LIMIT } from '../../../graphql/queries';

// TYPES
type PostType = {
  id: number,
  title: string,
  content: string,
  imgUrl: string,
  createdAt: string,
  updatedAt: string,
  // user: {
  //   id: number,
  //   name: string,
  //   email: string,
  //   createdAt: string,
  //   updatedAt: string
  // }
}

const RecentPosts = () => {

  const { data, loading, error } = useQuery(GET_POSTS_BY_ID_LIMIT, {
    variables: {
      uid: Number(), // backend (resolver) で id を指定しているので、空にする
      limit: Number(4),
    },
  }, 
  );
// destructuring
  const  { PostsByUserLimit }  = data ? data : [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>エラー: {error.message}</p>;
  

  return (
    <div className="container">
      {/* // TODO Fix this later */}
      {data && loading ? (<h1>Loading...</h1>) : ("")} 
      {data &&  error ? (<h1>Error...</h1>) : ("")}
      
      {data ? (
        <>
          <h1 style={{fontSize:"3rem", textAlign:"center"}}>Recent Posts</h1>

          <div className="row">
            {PostsByUserLimit.map((item: PostType) => (
              <div className="col-md-3 col-12 mb-4" key={item.id}>

                <Link to={`/postdetails/${item.id}`} className="card">
                  <img src={item.imgUrl} className="card-img-top" alt={item.title} />

                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.content}</p>
                    <p className="card-text"><small className="text-muted">{new Date(item.createdAt).toLocaleString()}</small></p>
                  </div>

                </Link>
              </div>
            ))}
          </div>
        </>
      ) : ("")}




    </div>
  )
}

export default RecentPosts