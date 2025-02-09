
import { request } from 'graphql-request'
import moment from 'moment';
import { toast } from 'react-hot-toast';
import { BoostButton } from 'myboostpow-lib';
import { useTheme } from 'next-themes';
const graphqlAPI = "https://gw.twetch.app";

export const twetchDetailQuery = async (txid: string | undefined) => {
  
  const query = `
  query postDetailQuery($txid: String!) {
    allPosts(condition: { transaction: $txid }) {
      edges {
        node {
          bContent
          bContentType
          createdAt
          files
          id
          numBranches
          numLikes
          postsByReplyPostId {
            totalCount
          }
          replyPostId
          transaction
          type
          youBranchedCalc
          youLikedCalc
          userId
          userByUserId {
            icon
            name
          }
        }
      }
    }
  }
  `;

  //const result = await graphqlClient.request(query, { txid });
  const result = await request(graphqlAPI, query, { txid });

  if (!result?.allPosts?.edges || result?.allPosts?.edges.length === 0) {
    return null
  }

  return result.allPosts.edges[0].node;
};


import { Dispatch, SetStateAction, useEffect, useState } from "react"
import PostDescription from './PostDescription';
import PostMedia from './PostMedia';
import UserIcon from './UserIcon';

export default function Twetch({ txid, setIsTwetch, difficulty }: { txid: string, setIsTwetch: Dispatch<SetStateAction<boolean>>, difficulty: number }) {
    const [loading, setLoading] = useState(false)

    const [post, setPost] = useState<any>()

    useEffect(() => {
        (async () => {
            setLoading(true)
          
          if (txid) {

            const result = await twetchDetailQuery(txid)

            setPost(result)
            setLoading(false)
          }



        })()

    }, [txid])

    if (loading){
        return (
            <div className=''>
                <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
    if(post){
        setIsTwetch(true)
        return (
              <TwetchCard {...post} difficulty={difficulty}/>
    ) 
    } else {
        return <></>
    }
}

export const TwetchCard = (props:any) => {
  const theme = useTheme()
  const handleBoostLoading = () => {
    toast('Publishing Your Boost Job to the Network', {
        icon: '⛏️',
        style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        },
      });
  };

  const handleBoostSuccess = () => {
    toast('Success!', {
        icon: '✅',
        style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        },
      });
  };

  const handleBoostError = () => {
    toast('Error!', {
        icon: '🐛',
        style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        },
    });
  };
  return (
    <div className='col-span-12 px-4 pt-4 pb-1  bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 sm:rounded-lg'>
      <div className='mb-0.5 px-4 pt-4 pb-1 grid items-start grid-cols-12 max-w-screen cursor-pointer'>
        <div className='col-span-1'>
            {/* <Link  href={`/u/${post.userId}`}> */}
            <a onClick={(e)=>e.stopPropagation()}>
                <UserIcon src={props.userByUserId.icon} size={46}/>
            </a>
            {/* </Link> */}
        </div>
        <div className='col-span-11 ml-6'>
            <div className='flex'>
            {/* <Link  href={`/u/${post.userId}`}> */}
                <div onClick={(e)=>e.stopPropagation()} className='text-base leading-4 font-bold text-gray-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis	hover:underline'>
                {props.userByUserId.name}<span className='ml-1 font-normal text-gray-500 dark:text-gray-300'>@{props.userId}</span>
                </div>
            {/* </Link> */}
            <div className='grow'/>
            <a target="_blank" rel="noreferrer" href={`https://whatsonchain.com/tx/${props.transaction}`} className='text-xs leading-5 whitespace-nowrap text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500'>
                {moment(props.createdAt).fromNow()}
            </a>
            <a href={`https://twetch.com/t/${props.transaction}`} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()}>
            <div className='flex items-center ml-4 h-5 w-5 text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500'>
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg> */}
                <svg viewBox="0 0 102 110" className="bg-gray-700 dark:bg-transparent rounded p-1">
                <path d="M3.66391 55.0011C-1.39212 46.1876 -1.04744 35.7272 3.66391 27.5017C8.37755 35.7272 8.72222 46.1876 3.66391 55.0011ZM3.66391 55.0011C-1.04744 63.2266 -1.39212 73.6871 3.66391 82.5006C8.72222 73.6871 8.37755 63.2266 3.66391 55.0011ZM51.0011 0C46.2898 8.22548 45.9451 18.6859 51.0011 27.4994C56.0572 18.6859 55.7125 8.22548 51.0011 0ZM51.0011 27.5017C46.2898 35.7272 45.9451 46.1876 51.0011 55.0011C56.0572 46.1876 55.7125 35.7272 51.0011 27.5017ZM51.0011 55.0011C46.2898 63.2266 45.9451 73.6871 51.0011 82.5006C56.0572 73.6871 55.7125 63.2266 51.0011 55.0011ZM51.0011 82.5006C46.2898 90.7261 45.9451 101.186 51.0011 110C56.0572 101.186 55.7125 90.7261 51.0011 82.5006ZM98.3361 27.5017C93.6247 35.7272 93.2801 46.1876 98.3361 55.0011C103.392 46.1876 103.047 35.7272 98.3361 27.5017ZM98.3361 55.0011C93.6247 63.2266 93.2801 73.6871 98.3361 82.5006C103.392 73.6871 103.047 63.2266 98.3361 55.0011ZM27.3325 13.7497C32.3908 22.5655 41.5647 27.4925 51.0011 27.4994C46.2761 19.2808 37.4469 13.7497 27.3325 13.7497ZM27.3325 13.7497C37.4469 13.7497 46.2761 8.21859 51.0011 0C41.5647 0.00689093 32.3908 4.93621 27.3325 13.7497ZM27.3325 13.7497C22.2765 22.5655 22.6212 33.026 27.3325 41.2514C32.0462 33.026 32.3908 22.5655 27.3325 13.7497ZM3.66619 27.4994C13.1026 27.4925 22.2765 22.5632 27.3325 13.7497C17.2182 13.7497 8.38896 19.2808 3.66619 27.4994ZM74.6675 13.7497C79.7258 22.5655 88.8997 27.4925 98.3361 27.4994C93.611 19.2808 84.7818 13.7497 74.6675 13.7497ZM74.6675 13.7497C69.6114 22.5655 69.9561 33.026 74.6675 41.2514C79.3811 33.026 79.7258 22.5655 74.6675 13.7497ZM51.0011 27.4994C60.4375 27.4925 69.6114 22.5632 74.6675 13.7497C64.5531 13.7497 55.7239 19.2808 51.0011 27.4994ZM51.0011 0C55.7239 8.21859 64.5554 13.7497 74.6675 13.7497C69.6114 4.93621 60.4375 0.00689093 51.0011 0ZM27.3325 41.2491C32.3908 50.0649 41.5647 54.992 51.0011 54.9989C46.2761 46.7803 37.4469 41.2491 27.3325 41.2491ZM27.3325 41.2491C37.4469 41.2491 46.2761 35.718 51.0011 27.4994C41.5647 27.5063 32.3908 32.4356 27.3325 41.2491ZM27.3325 41.2491C22.2765 50.0649 22.6212 60.5254 27.3325 68.7509C32.0462 60.5254 32.3908 50.0649 27.3325 41.2491ZM3.66619 55.0011C13.1026 54.9943 22.2765 50.0649 27.3325 41.2514C17.2182 41.2491 8.38896 46.7803 3.66619 55.0011ZM3.66619 27.4994C8.38896 35.718 17.2205 41.2491 27.3325 41.2491C22.2765 32.4356 13.1003 27.5063 3.66619 27.4994ZM74.6675 41.2491C79.7258 50.0649 88.8997 54.992 98.3361 54.9989C93.611 46.7803 84.7818 41.2491 74.6675 41.2491ZM74.6675 41.2491C84.7818 41.2491 93.611 35.718 98.3361 27.4994C88.8997 27.5063 79.7258 32.4356 74.6675 41.2491ZM74.6675 41.2491C69.6114 50.0649 69.9561 60.5254 74.6675 68.7509C79.3811 60.5254 79.7258 50.0649 74.6675 41.2491ZM51.0011 55.0011C60.4375 54.9943 69.6114 50.0649 74.6675 41.2514C64.5531 41.2491 55.7239 46.7803 51.0011 55.0011ZM51.0011 27.4994C55.7239 35.718 64.5554 41.2491 74.6675 41.2491C69.6114 32.4356 60.4375 27.5063 51.0011 27.4994ZM27.3325 68.7509C32.3908 77.5667 41.5647 82.4937 51.0011 82.5006C46.2761 74.282 37.4469 68.7509 27.3325 68.7509ZM27.3325 68.7509C37.4469 68.7509 46.2761 63.2197 51.0011 55.0011C41.5647 55.008 32.3908 59.9351 27.3325 68.7509ZM27.3325 68.7509C22.2765 77.5667 22.6212 88.0271 27.3325 96.2526C32.0462 88.0248 32.3908 77.5644 27.3325 68.7509ZM3.66619 82.5006C13.1026 82.4937 22.2765 77.5644 27.3325 68.7509C17.2182 68.7509 8.38896 74.282 3.66619 82.5006ZM3.66619 55.0011C8.38896 63.2197 17.2205 68.7509 27.3325 68.7509C22.2765 59.9351 13.1003 55.008 3.66619 55.0011ZM74.6675 68.7509C79.7258 77.5667 88.8997 82.4937 98.3361 82.5006C93.611 74.282 84.7818 68.7509 74.6675 68.7509ZM74.6675 68.7509C84.7818 68.7509 93.611 63.2197 98.3361 55.0011C88.8997 55.008 79.7258 59.9351 74.6675 68.7509ZM74.6675 68.7509C69.6114 77.5667 69.9561 88.0271 74.6675 96.2526C79.3811 88.0248 79.7258 77.5644 74.6675 68.7509ZM51.0011 82.5006C60.4375 82.4937 69.6114 77.5644 74.6675 68.7509C64.5531 68.7509 55.7239 74.282 51.0011 82.5006ZM51.0011 55.0011C55.7239 63.2197 64.5554 68.7509 74.6675 68.7509C69.6114 59.9351 60.4375 55.008 51.0011 55.0011ZM27.3325 96.2503C32.3908 105.066 41.5647 109.993 51.0011 110C46.2761 101.781 37.4469 96.2503 27.3325 96.2503ZM27.3325 96.2503C37.4469 96.2503 46.2761 90.7192 51.0011 82.5006C41.5647 82.5075 32.3908 87.4368 27.3325 96.2503ZM3.66619 82.5006C8.38896 90.7192 17.2205 96.2503 27.3325 96.2503C22.2765 87.4368 13.1003 82.5075 3.66619 82.5006ZM74.6675 96.2503C84.7818 96.2503 93.611 90.7192 98.3361 82.5006C88.8997 82.5075 79.7258 87.4368 74.6675 96.2503ZM51.0011 110C60.4375 109.993 69.6114 105.064 74.6675 96.2503C64.5531 96.2503 55.7239 101.781 51.0011 110ZM51.0011 82.5006C55.7239 90.7192 64.5554 96.2503 74.6675 96.2503C69.6114 87.4368 60.4375 82.5075 51.0011 82.5006Z" fill="white"></path>
                </svg>
            </div>
            </a>
            </div>
            <PostDescription bContent={props.bContent}/>
            <PostMedia files={JSON.parse(props.files)}/>
        </div>
      </div>
      <div className='flex w-full px-16'>
        <div className="grow"/>
        <BoostButton
            content={props.txid}
            difficulty={props.difficulty}
            //@ts-ignore
            theme={theme.theme}
            showDifficulty
            onSending={handleBoostLoading}
            onError={handleBoostError}
            onSuccess={handleBoostSuccess}
        />
      </div>
  </div>
  )
}