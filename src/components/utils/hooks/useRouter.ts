import { useLocation, useNavigate } from 'react-router'

export function useURouter() {
  const location = useLocation()
  const navigate = useNavigate()
  return { location, navigate }
}
