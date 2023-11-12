import Head from 'next/head'
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { OverviewBudget } from 'src/sections/overview/overview-budget'
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders'
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products'
import { useEffect, useState } from 'react'
import api from '../services/api'
const Page = () => {
  const [products, setProducts] = useState([])
  const [billing, setBilling] = useState([])
  const [top10Products, setTop10Products] = useState([])

  useEffect(() => {
    try {
      api.get('billing').then((response) => {
        setBilling(response.data)
      })
      api.get('productDetails').then((response) => {
        setProducts(response.data)

        setTop10Products(
          response.data.slice(0, 10).map((product) => {
            return {
              id: product.id,
              name: product.description,
              price: product.price,
            }
          }),
        )
      })
    } catch (erro) {
      console.error('Erro ao buscar dados:', erro.message)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Billing system</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          paddingBottom: '5px',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3} sx={{ paddingBottom: '5px' }}>
            <Grid xs={12} sm={6} lg={4}>
              <OverviewBudget
                difference={12}
                positive
                sx={{ height: '100%' }}
                value={`€ ${billing.lastHour}`}
                title="Hourly billing"
                icon="hour"
              />
            </Grid>

            <Grid xs={12} sm={6} lg={4}>
              <OverviewBudget
                difference={12}
                positive
                sx={{ height: '100%' }}
                value={`€ ${billing.lastDay}`}
                title="Day billing"
                icon="day"
              />
            </Grid>

            <Grid xs={12} sm={6} lg={4}>
              <OverviewBudget
                difference={12}
                positive
                sx={{ height: '100%' }}
                value={`€ ${billing.lastMonth}`}
                title="Month billing"
                icon="month"
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewLatestProducts
                products={top10Products}
                sx={{ height: '250px', overflow: 'auto', marginLeft: '35px' }}
              />
            </Grid>
            <Grid xs={12} md={12} lg={8}>
              <OverviewLatestOrders
                orders={products}
                sx={{
                  height: '250px',
                  overflow: 'auto',
                  marginLeft: '35px',
                  minWidth: 550,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
