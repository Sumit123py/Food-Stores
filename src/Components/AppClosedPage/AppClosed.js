import React from 'react'
import './appClosed.css'
import Spinner from '../../spinLoader/Spinner';
import { getUser } from '../../Services/apiUsers';
import { useQuery } from '@tanstack/react-query';
const AppClosed = () => {

    const { isLoading, data: users } = useQuery({
        queryKey: ["users"],
        queryFn: getUser,
      });

      const user = users?.filter((item) => item.role === 'admin')
      isLoading && <Spinner/>
  return (
    <div className='appClosedContainer'>

        <div className="appClosed">
            <div className="image">
                <img src={user?.[0].logoImage} alt="" />

            </div>
            <p><span>Sorry, We Are Closed</span></p>
        </div>
      
    </div>
  )
}

export default AppClosed
