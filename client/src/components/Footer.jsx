import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import {BsFacebook,BsInstagram,BsTwitter,BsGithub,BsDribbble} from 'react-icons/bs'

export default function FooterCom() {
  return (
    <Footer container className='border border-t-3 border-gray-300'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                <div className='mt-5'>
                    <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                        <span className='px-2 py-1 bg-gradient-to-r from-slate-900 to-slate-400 rounded-lg text-white'>JGS</span>
                        Blog
                    </Link>
                </div>
                <div className='grid grid-cols-2 gap-8  mt-4 sm:grid-cols-3 sm:gap-6'>
                    <div>
                        <Footer.Title title='About'/>
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='https://pankajkr.onrender.com/'
                                target='_blank'
                                rel='noopener noreferre'
                                >Pankaj Profile
                            </Footer.Link>
                            <Footer.Link
                                href='/about'
                                target='_blank'
                                rel='noopener noreferre'
                                >JGS Blog
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='Follow us'/>
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='https://github.com/pankaj2605'
                                target='_blank'
                                rel='noopener noreferre'
                                >Github
                            </Footer.Link>
                            <Footer.Link
                                href='#'
                                target='_blank'
                                rel='noopener noreferre'
                                >Discord
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='Privacy Policy'/>
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='#'
                                target='_blank'
                                rel='noopener noreferre'
                                >Privacy Policy
                            </Footer.Link>
                            <Footer.Link
                                href='#'
                                target='_blank'
                                rel='noopener noreferre'
                                >Terms & Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider/>
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
                <Footer.Copyright href='#' by="JGS blog" year={new Date().getFullYear()}/>
                <div className='flex  gap-6 sm:mt-0 mt-4 sm:justify-center'>
                    <Footer.Icon href='#' icon={BsFacebook}/>
                    <Footer.Icon href='#' icon={BsInstagram}/>
                    <Footer.Icon href='#' icon={BsTwitter}/>
                    <Footer.Icon href='https://github.com/pankaj2605' icon={BsGithub}/>
                    <Footer.Icon href='#' icon={BsDribbble}/>
                </div>
            </div>
        </div>
    </Footer>
  )
}