<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="xs" version="2.0">
    
    
    <xsl:template match="map">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE map PUBLIC "-//IFRS//DTD DITA Map//EN" "../../DocTypes/com.ifrs.doctype/dtd/ifrsMap.dtd"&gt;</xsl:text>
        <map>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </map>
    </xsl:template>
    
    <xsl:template match="bookmap">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE bookmap PUBLIC "-//IFRS//DTD DITA BookMap//EN" "../../DocTypes/com.ifrs.doctype/dtd/ifrsBookmap.dtd"&gt;</xsl:text>
        <bookmap>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </bookmap>
    </xsl:template>
    
    <xsl:template match="topic">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE topic PUBLIC "-//IFRS//DTD DITA Topic//EN" "../../../DocTypes/com.ifrs.doctype/dtd/ifrsTopic.dtd"&gt;</xsl:text>
        <topic>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </topic>
    </xsl:template>
    
    <xsl:template match="paragraph">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE paragraph PUBLIC "-//IFRS//DTD DITA Paragraph//EN" "../../../DocTypes/com.ifrs.doctype/dtd/paragraph.dtd"&gt;</xsl:text>
        <paragraph>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </paragraph>
    </xsl:template>
    
    <xsl:template match="glossentry">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE glossentry PUBLIC "-//IFRS//DTD DITA Glossary Entry//EN" "../../../DocTypes/com.ifrs.doctype/dtd/ifrsGlossentry.dtd"&gt;</xsl:text>
        <glossentry>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </glossentry>
    </xsl:template>
    
    
    <xsl:template match="@* | node()">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="appendices">
        <topicref>
            <xsl:attribute name="chunk"><xsl:value-of select="'to-content'"/></xsl:attribute>
            <xsl:if test="@href"><xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute></xsl:if>
            <xsl:attribute name="class"><xsl:value-of select="'- map/topicref '"/></xsl:attribute>
            <xsl:attribute name="navtitle"><xsl:value-of select="'Appendices'"/></xsl:attribute>
            <xsl:apply-templates/>
        </topicref>
    </xsl:template>
    
    
    <xsl:template match="appendix">
        <topicref>
            <xsl:if test="@href"><xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute></xsl:if>
            <xsl:attribute name="class"><xsl:value-of select="'- map/topicref '"/></xsl:attribute>
<!--            <xsl:if test="@navtitle"><xsl:attribute name="navtitle"><xsl:value-of select="@navtitle"/></xsl:attribute></xsl:if>-->
            <xsl:apply-templates/>
        </topicref>
    </xsl:template>
    
    <xsl:template match="backmatter">
        <xsl:choose>
            <xsl:when test="@href">
                <topicref>
                    <xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute>
                    <xsl:attribute name="class"><xsl:value-of select="'- map/topicref '"/></xsl:attribute>
<!--                    <xsl:attribute name="navtitle"><xsl:value-of select="'Backmatter'"/></xsl:attribute>-->
                    <xsl:apply-templates/>
                </topicref>
            </xsl:when>
            <xsl:otherwise>
                <xsl:apply-templates/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    
</xsl:stylesheet>
