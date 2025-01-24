export const CDPDocs = {
    segment: {
      tracking: {
        keywords: ['track', 'event', 'analytics', 'tracking'],
        response: "To track events in Segment:\n1. Initialize the analytics object\n2. Use analytics.track('Event Name', properties)\n3. Verify in the Segment debugger"
      },
      identity: {
        keywords: ['identify', 'user', 'traits', 'customer'],
        response: "To identify users in Segment:\n1. Call analytics.identify(userId, traits)\n2. Include relevant user traits\n3. User profiles will be created automatically"
      }
    },
    mparticle: {
      setup: {
        keywords: ['setup', 'initialize', 'configuration'],
        response: "To set up mParticle:\n1. Get your API credentials\n2. Initialize the mParticle SDK\n3. Configure your data points"
      },
      audiences: {
        keywords: ['audience', 'segment', 'users'],
        response: "To create audiences in mParticle:\n1. Go to Audience Builder\n2. Define audience criteria\n3. Set update frequency"
      }
    },
    lytics: {
      collection: {
        keywords: ['collect', 'data', 'stream'],
        response: "To collect data in Lytics:\n1. Set up data streams\n2. Configure collection rules\n3. Validate incoming data"
      }
    },
    zeotap: {
      integration: {
        keywords: ['integrate', 'connect', 'source'],
        response: "To integrate data sources in Zeotap:\n1. Navigate to Sources\n2. Select your data source\n3. Configure connection settings"
      }
    }
  };
  export default CDPDocs


// import React from 'react'

// function CDPDocs() {
//   return (
//     <div>
//         hello varun
//     </div>
//   )
// }

// export default CDPDocs

