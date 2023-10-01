// Apollo Client
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_ID } from '../../../graphql/queries';

// TYPES
type PostType = {
  id: number,
  title: string,
  content: string,
  imgUrl: string,
  createdAt: string,
  updatedAt: string,
  user: {
    id: number,
    name: string,
    email: string,
    createdAt: string,
    updatedAt: string
  }
}

const RecentPosts = () => {

  const { data, loading, error } = useQuery(GET_POSTS_BY_ID, {
    variables: {
      uid: Number() // backend (resolver) で id を指定しているので、空にする
    }
  });
// destructuring
  const  { PostsByUser }  = data ? data : [];

  // if(data) console.log(data);

  return (
    <div className="container">
      {/* // TODO Fix this later */}
      {data && loading ? (<h1>Loading...</h1>) : ("")} 
      {data &&  error ? (<h1>Error...</h1>) : ("")}
      
      {data ? (
        <>
          <h1 style={{fontSize:"3rem", textAlign:"center"}}>Recent Posts</h1>

          <div className="row">
            {PostsByUser.map((item: PostType) => (
              <div className="col-md-3 col-12 mb-4" key={item.id}>

                <div className="card">
                  <img src={item.imgUrl} className="card-img-top" alt={item.title} />

                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.content}</p>
                    <p className="card-text"><small className="text-muted">{item.createdAt}</small></p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </>
      ) : ("")}




    </div>
  )
}

export default RecentPosts