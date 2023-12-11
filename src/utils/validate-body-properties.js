export function validateBodyProperties({ requiredProperties, body }) {
  const validation = requiredProperties.reduce((missingProperties, property) => {
    if (!body || !body[property]) missingProperties.push(`Missing ${property} in request body`)
    return missingProperties
  }, [])

  if (!validation.length) return null
  return validation
}