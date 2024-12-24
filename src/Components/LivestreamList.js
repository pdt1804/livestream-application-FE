import { useEffect, useState } from "react"
import LivestreamItem from "./LivestreamItem"
import axios from "axios"
import { BASE_URL, checkError } from "../Resource"

export default function LivestreamList() {
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    const gettingSessions = async () => {
      const request = await axios.get(BASE_URL + "/api/v1/livestream/getAllSessions");
      if (request.status === 200) {
        const errorMessage = checkError(request.data);
        if (errorMessage === null) {
          setSessions(request.data)
        } else {
          console.error(errorMessage)
        }
      }
    }

    gettingSessions()
  }, [])

  return (
    <div className="LivestreamList">
      {sessions && sessions.map((item) => <LivestreamItem session={item}/>)}
    </div>
  )
}