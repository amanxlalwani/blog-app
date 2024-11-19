import { Suspense} from 'react'
import './App.css'
import { BrowserRouter,Routes,Route, useNavigate } from 'react-router-dom';
import Signin from './Pages/Signin';
import Loading from './components/Loading';
import Signup from './Pages/Signup';

import Blog from './Pages/Blog';
import Blogs from './Pages/Blogs';

import useSigned from './hooks/useSigned';
import CreateBlog from './Pages/CreateBlog';
import MyBlogs from './Pages/MyBlogs';
import UpdateBlog from './Pages/UpdateBlog';


 function App() {
   
  

  return (
    <>
      <div className='h-screen'>
      <BrowserRouter>
    <Routes>
      <Route path='/' element={<Suspense fallback={<Loading></Loading>}><Default></Default></Suspense>} > </Route>
      <Route path='/signin' element={<Suspense fallback={<Loading></Loading>}><Signin></Signin></Suspense>} ></Route>
      <Route path='/signup' element={<Suspense fallback={<Loading></Loading>}><Signup></Signup></Suspense>} ></Route>
      <Route path='/blog/:id' element={<Suspense fallback={<Loading></Loading>}><Blog></Blog></Suspense>} ></Route>
      <Route path='/updateblog/:id' element={<Suspense fallback={<Loading></Loading>}><UpdateBlog></UpdateBlog></Suspense>} ></Route>
      <Route path='/blogs' element={<Suspense fallback={<Loading></Loading>}><Blogs></Blogs> </Suspense>}></Route>
      <Route path='/myblogs' element={<Suspense fallback={<Loading></Loading>}> <MyBlogs></MyBlogs> </Suspense>}></Route>
      <Route path='/createblog' element={<Suspense fallback={<Loading></Loading>}><CreateBlog></CreateBlog> </Suspense>}></Route>

    </Routes> 
    </BrowserRouter>
    </div>

    </>
  )
}

 function Default(){
  const{isSigned,isLoading}=useSigned();
  const navigate= useNavigate();
   


   if(isLoading){
    return<>
    <Loading></Loading>
    </>
   }

   if(isSigned){
    navigate("/blogs")
  }
  else{
    navigate("/signin")
  }
  
  return <>
  
  </>
}



export default App
