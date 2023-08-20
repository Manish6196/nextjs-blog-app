'use client'

import styles from './page.module.css'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ImageUpload from '@/components/form/ImageUpload'
import { useState } from 'react'

const Dashboard = () => {
  const session = useSession()
  const router = useRouter()
  const [title, setTitle] = useState()
  const [desc, setDesc] = useState()
  const [img, setImg] = useState()
  const [content, setContent] = useState()

  const fetcher = (...args) => fetch(...args).then(res => res.json())

  const { data, mutate, error, isLoading } = useSWR(
    `/api/posts?username=${session?.data?.user.name}`,
    fetcher
  )

  if (session.status === 'loading') {
    return <p>Loading...</p>
  }

  if (session.status === 'unauthenticated') {
    router?.push('/dashboard/login')
  }

  const handleSubmit = async () => {
    try {
      await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          desc,
          img,
          content,
          username: session.data.user.name,
        }),
      })
      mutate()
      e.target.reset()
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async id => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })
      mutate()
    } catch (err) {
      console.log(err)
    }
  }

  if (session.status === 'authenticated') {
    return (
      <div className={styles.container}>
        <div className={styles.posts}>
          {isLoading
            ? 'loading'
            : data?.map(post => (
                <div className={styles.post} key={post._id}>
                  <div className={styles.imgContainer}>
                    <Image src={post.img} alt='' width={200} height={100} />
                  </div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <span
                    className={styles.delete}
                    onClick={() => handleDelete(post._id)}
                  >
                    X
                  </span>
                </div>
              ))}
        </div>
        <div className={styles.new}>
          <h1>Add New Post</h1>
          <input
            type='text'
            placeholder='Title'
            className={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type='text'
            placeholder='Desc'
            className={styles.input}
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <ImageUpload onChange={value => setImg(value)} value={img} />
          <textarea
            placeholder='Content'
            className={styles.textArea}
            cols='30'
            rows='10'
            onChange={e => setContent(e.target.value)}
          >
            {content}
          </textarea>
          <button className={styles.button} onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>
    )
  }
}

export default Dashboard
