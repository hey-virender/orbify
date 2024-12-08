import { Skeleton } from '@mui/material'
import React from 'react'

const MenuSkeleton = () => {
  return (
    <div className='flex flex-col items-center gap-5'>
      <Skeleton variant='circular' width={100} height={100}/>
      <Skeleton variant='rectangular' width={"40%"} height={"20px"} />
      <Skeleton variant='rectangular' width={"40%"} height={"20px"} />
      <Skeleton variant='rectangular' width={"100%"} height={"40vh"}/>
    </div>
  )
}

export default MenuSkeleton