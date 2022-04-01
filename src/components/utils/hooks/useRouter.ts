import { useLocation, useNavigate } from 'react-router'

export function useRouter() {
  const location = useLocation()
  const navigate = useNavigate()
  return { location, navigate }
}
