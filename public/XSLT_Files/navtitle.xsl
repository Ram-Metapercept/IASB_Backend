<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl"
    exclude-result-prefixes="xs xd"
    version="2.0">
    
    
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
    
    <xsl:template match="topicref">
        <!--<xsl:variable name="sdsd" select="'file:///D:\Work_From_Home\Metapercept\Project\iasb\updated_DITA_files\Required Bound Volume 2023-17August2023\DITA source\BB2023_XML_resupply\BB2023-B_ditamap/'"/>-->
        <xsl:variable name="sdsd" select="replace(base-uri(), concat('/', tokenize(base-uri(.), '/')[last()]), '/')"/>
        <xsl:element name="topicref">
            <xsl:copy-of select="@* except @navtitle"/>
            <xsl:attribute name="navtitle">
                <xsl:choose>
                    <xsl:when test="document(concat($sdsd, @href))/topic/title">
                        <xsl:value-of select="document(concat($sdsd, @href))/topic/title"/>
                    </xsl:when>
                    <xsl:when test="document(concat($sdsd, @href))/paragraph/titlealts/navtitle">
                        <xsl:value-of select="document(concat($sdsd, @href))/paragraph/titlealts/navtitle"/>
                    </xsl:when>
                    <xsl:when test="document(concat($sdsd, @href))/glossentry/glossterm">
                        <xsl:value-of select="document(concat($sdsd, @href))/glossentry/glossterm"/>
                    </xsl:when>
                    <xsl:otherwise>
                        
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            <xsl:if test="@navtitle = 'Rubric'">
                <xsl:attribute name="navtitle" select="'Rubric'"/>
            </xsl:if>
            <xsl:if test="@navtitle = 'Rubric Toc'">
                <xsl:attribute name="navtitle" select="'Rubric Toc'"/>
            </xsl:if>
            <xsl:if test="@navtitle = 'Appendices'">
                <xsl:attribute name="navtitle" select="'Appendices'"/>
            </xsl:if>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="mapref">
        <xsl:variable name="sdsd" select="replace(base-uri(), concat('/', tokenize(base-uri(.), '/')[last()]), '/')"/>
<!--        <xsl:variable name="sdsd" select="'file:///D:\Work_From_Home\Metapercept\Project\iasb\updated_DITA_files\Required Bound Volume 2023-17August2023\DITA source\BB2023_XML_resupply\BB2023-B_ditamap/'"/>-->
        <xsl:element name="mapref">
            <xsl:copy-of select="@*"/>
            <xsl:attribute name="navtitle">
                <xsl:choose>
                    <xsl:when test="normalize-space(document(concat($sdsd, @href))/bookmap/booktitle/mainbooktitle)">
                        <xsl:value-of select="normalize-space(document(concat($sdsd, @href))/bookmap/booktitle/mainbooktitle)"/>
                    </xsl:when>
<!--                    <xsl:when test="document(concat($sdsd, @href))/paragraph/titlealts/navtitle">
                        <xsl:value-of select="document(concat($sdsd, @href))/paragraph/titlealts/navtitle"/>
                    </xsl:when>
                    <xsl:when test="document(concat($sdsd, @href))/glossentry/glossterm">
                        <xsl:value-of select="document(concat($sdsd, @href))/glossentry/glossterm"/>
                    </xsl:when>-->
                    <xsl:otherwise>
                        
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
<!--    <xsl:template match="appendix">
        <!-\-<xsl:variable name="sdsd" select="'file:///E:\working\2024\IASB\26-03-2024\BB2023-C_ditamap/'"/>-\->
        <xsl:variable name="sdsd" select="replace(base-uri(), concat('/', tokenize(base-uri(.), '/')[last()]), '/')"/>
        <xsl:element name="appendix">
            <xsl:copy-of select="@* except @navtitle"/>
            <xsl:if test="@href">
                <xsl:attribute name="navtitle">
                    <xsl:choose>
                        <xsl:when test="document(concat($sdsd, @href))/topic/title">
                            <xsl:value-of select="document(concat($sdsd, @href))/topic/normalize-space(title)"/>
                        </xsl:when>
                        <xsl:when test="document(concat($sdsd, @href))/paragraph/titlealts/navtitle">
                            <xsl:value-of select="document(concat($sdsd, @href))/paragraph/titlealts/normalize-space(navtitle)"/>
                        </xsl:when>
                        <xsl:when test="document(concat($sdsd, @href))/glossentry/glossterm">
                            <xsl:value-of select="document(concat($sdsd, @href))/glossentry/normalize-space(glossterm)"/>
                        </xsl:when>
                        <xsl:otherwise>
                            
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
-->    
</xsl:stylesheet>