import pkg from '../../package.json'

function About() {
  return (
    <div style={{ p: '2 auto', margin: '2em' }}>
      <h2 style={{ textAlign: 'center' }}>PlanPals v{pkg.version}</h2>
      <header className="App-header">
        <p className="List-header">
          PlanPals is a planning platform that helps you and your friends, family, or colleagues plan trips, shop
          together, and manage tasks effectively and stress free. Whether you’re making travel itineraries, sharing
          shopping lists, or keeping track of tasks, PlanPals lets everyone collaborate in real-time, so nobody misses a
          beat. You can easily invite or remove people from your planning group, change the details of your shared
          plans, and even vote on ideas to make sure everyone is involved and their preferences are considered. Our goal
          with PlanPals is to make planning together enjoyable and straightforward, so you can spend less time
          organizing and more time enjoying your plans.
        </p>
        <p className="List-header">
          Vision Statement: To make planning fun and easy for groups, helping friends and family come together
          effortlessly when organizing trips and managing tasks.
        </p>
      </header>
    </div>
  )
}

export default About
