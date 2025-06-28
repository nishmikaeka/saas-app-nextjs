import { Button } from '@/components/ui/button'
import React from 'react'
import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionList'
import Cta from '@/components/Cta'
import { recentSessions } from '@/constants'
const Page = () => {
  return (
    <main>
      <h1 className='text-2xl underline'>Popular Companions</h1>
      <section className='home-section'>
        <CompanionCard 
          id='123'
          name='Neura the brain explorer'
          topic='Neural network of the brain'
          subject='science'
          duration={45}
          color='#ffda6e'
        />
        <CompanionCard
          id='456'
          name='Countsy the number wizard'
          topic='Derivatives and Integrals'
          subject='maths'
          duration={30}
          color='#e5d0ff'
        />
        <CompanionCard
          id='789'
          name='Verba the vocabulary builder'
          topic='English Literature'
          subject='english'
          duration={30}
          color='#bd37ff'
        />
      </section>
      <section className='home-section'>
        <CompanionList
          title='Recently completed sessions'
          companions={recentSessions}
          classNames='w-2/3 max-lg:w-full'
        />
        <Cta/>
      </section>

    </main>
  )
}

export default Page