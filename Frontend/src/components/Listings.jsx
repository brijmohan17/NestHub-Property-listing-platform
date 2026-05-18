import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa'
import { useDebounce } from '../hooks/useDebounce'
import { buildListingsSearchUrl } from '../utils/api'

const Listings = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''
  const location = searchParams.get('location') || ''
  const country = searchParams.get('country') || ''
  const sortBy = searchParams.get('sortBy') || 'title'
  const sortDir = searchParams.get('sortDir') || 'asc'
  const debouncedQ = useDebounce(q, 400)

  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const hasSearch = debouncedQ || location || country
      let url
      if (hasSearch) {
        url = buildListingsSearchUrl({
          q: debouncedQ || undefined,
          location: location || undefined,
          country: country || undefined,
          sortBy,
          sortDir,
          page: String(page),
          size: '12',
        })
      } else {
        url = '/listings'
      }

      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}${url}`)
      if (!response.ok) throw new Error('Failed to load listings')
      const data = await response.json()

      if (hasSearch && data.content) {
        setListings((prev) => (page === 0 ? data.content : [...prev, ...data.content]))
        setTotalElements(data.totalElements)
        setHasNext(data.hasNext)
      } else {
        setListings(Array.isArray(data) ? data : [])
        setTotalElements(Array.isArray(data) ? data.length : 0)
        setHasNext(false)
      }
    } catch (err) {
      setError('Failed to load listings. Please try again.')
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [debouncedQ, location, country, sortBy, sortDir, page])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  useEffect(() => {
    setPage(0)
  }, [debouncedQ, location, country, sortBy, sortDir])

  const handleListClick = (id) => {
    navigate(`/listings/${id}`)
  }

  const isSearchActive = Boolean(debouncedQ || location || country)

  if (loading && listings.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff385c]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSearchActive && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600">
              {totalElements} {totalElements === 1 ? 'result' : 'results'}
              {debouncedQ && (
                <span>
                  {' '}
                  for <span className="font-semibold text-gray-800">&quot;{debouncedQ}&quot;</span>
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [by, dir] = e.target.value.split('-')
                  const next = new URLSearchParams(searchParams)
                  next.set('sortBy', by)
                  next.set('sortDir', dir)
                  setSearchParams(next)
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#ff385c] focus:outline-none"
              >
                <option value="title-asc">Title A–Z</option>
                <option value="title-desc">Title Z–A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500">{error}</div>
        )}

        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((item) => (
              <div
                key={item._id}
                onClick={() => handleListClick(item._id)}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={item.image?.url}
                    alt={item.title}
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
                    ₹{item.price}/night
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <FaMapMarkerAlt className="mr-1 shrink-0" />
                    <span className="truncate">
                      {item.location}, {item.country}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!error && listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {isSearchActive ? 'No listings match your search' : 'No listings found'}
            </p>
            {isSearchActive && (
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="mt-4 text-[#ff385c] hover:underline font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {hasNext && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="px-6 py-3 bg-[#ff385c] text-white rounded-lg hover:bg-[#e63650] transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Listings
